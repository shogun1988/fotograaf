const express = require('express');
const {
  USERNAME,
  updatePassword,
  verifyPassword
} = require('../auth');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.authenticated) {
    return res.redirect('/');
  }

  res.render('auth/login', {
    title: 'Inloggen',
    error: req.query.error || ''
  });
});

router.post('/login', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const passwordCorrect = await verifyPassword(req.body.password);

    if (username !== USERNAME || !passwordCorrect) {
      return res.redirect('/auth/login?error=Ongeldige+inloggegevens.');
    }

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.authenticated = true;
      return res.redirect('/');
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.clearCookie('fotograaf.sid');
    return res.redirect('/auth/login');
  });
});

router.get('/account', (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect('/auth/login');
  }

  return res.render('auth/account', {
    title: 'Mijn account',
    username: USERNAME,
    error: req.query.error || '',
    success: req.query.success || ''
  });
});

router.post('/account/password', async (req, res, next) => {
  if (!req.session.authenticated) {
    return res.redirect('/auth/login');
  }

  const currentPassword = req.body.currentPassword || '';
  const newPassword = req.body.newPassword || '';
  const confirmPassword = req.body.confirmPassword || '';

  if (newPassword.length < 8) {
    return res.redirect('/auth/account?error=Je+nieuwe+wachtwoord+moet+minstens+8+tekens+bevatten.');
  }

  if (newPassword !== confirmPassword) {
    return res.redirect('/auth/account?error=De+nieuwe+wachtwoorden+komen+niet+overeen.');
  }

  try {
    const changed = await updatePassword(currentPassword, newPassword);

    if (!changed) {
      return res.redirect('/auth/account?error=Het+huidige+wachtwoord+is+onjuist.');
    }

    return res.redirect('/auth/account?success=Je+wachtwoord+is+veilig+gewijzigd.');
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
