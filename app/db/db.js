const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'fotograaf.db');
const sqlite = new Database(DB_PATH);

sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Wrap better-sqlite3 (sync) to look like pg's async pool.query($1,$2 style)
function query(sql, params = []) {
  // Convert pg positional params ($1, $2, ...) to SQLite (?, ?, ...)
  const sqliteSQL = sql.replace(/\$(\d+)/g, '?');

  // Convert pg SERIAL / sequences: not needed at query time
  // Convert CONCAT(...) to SQLite: handled by seed schema
  // Convert ::int, ::text casts
  const cleanSQL = sqliteSQL
    .replace(/::(int|integer|text|numeric|boolean|bigint)/gi, '')
    .replace(/NULLS LAST/gi, '')
    .replace(/NULLS FIRST/gi, '');

  try {
    const stmt = sqlite.prepare(cleanSQL);
    const isSelect = /^\s*(SELECT|WITH|PRAGMA)/i.test(cleanSQL);

    if (isSelect) {
      const rows = stmt.all(...params);
      return Promise.resolve({ rows, rowCount: rows.length });
    }

    const info = stmt.run(...params);
    // Mimic pg RETURNING by re-fetching last inserted/updated row if needed
    return Promise.resolve({ rows: [], rowCount: info.changes, lastID: info.lastInsertRowid });
  } catch (err) {
    return Promise.reject(err);
  }
}

// For routes that use RETURNING id after INSERT, we need a special helper.
// We expose queryReturning for those cases.
function queryReturning(sql, params = []) {
  // Execute the INSERT/UPDATE and then fetch the last inserted row
  const sqliteSQL = sql
    .replace(/\$(\d+)/g, '?')
    .replace(/::(int|integer|text|numeric|boolean|bigint)/gi, '')
    .replace(/NULLS LAST/gi, '')
    .replace(/NULLS FIRST/gi, '');

  // Strip RETURNING clause
  const withoutReturning = sqliteSQL.replace(/\s+RETURNING\s+\S+\s*$/i, '');

  try {
    const stmt = sqlite.prepare(withoutReturning);
    const info = stmt.run(...params);
    return Promise.resolve({ rows: [{ id: info.lastInsertRowid }], rowCount: info.changes, lastID: info.lastInsertRowid });
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = { query, queryReturning, sqlite };
