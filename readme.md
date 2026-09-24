# 📷 Photographer Web App

> **A simple online workspace for photographers.**  
> Manage clients, plan photo shoots, and keep track of invoices in one place.

---

## 🧭 Follow this order

Using the app for the first time? Follow these steps from top to bottom:

1. Install **Git** and **Node.js** on your computer.
2. Download the app from GitHub.
3. Prepare the app once.
4. Start the app and open it in your browser.
5. Log in.
6. Use the different sections, such as clients and photo shoots.

> ℹ️ You do not need to be a programmer. Just follow the steps one by one.

---

## 🛠️ Install the app for the first time

Use these instructions when you install the app on your computer for the first time.

### 1. Install Git

**Git** is a program that lets you download the project from GitHub onto your computer.

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win).
2. Download and open the installation file.
3. Follow the instructions on the screen. You can keep the default choices.
4. Close and reopen your terminal after the installation has finished.

### 2. Install Node.js

The app needs **Node.js** to work.

1. Go to [nodejs.org](https://nodejs.org/).
2. Download the version marked **LTS**.
3. Open the downloaded file and follow the instructions on the screen.
4. Close and reopen your terminal after the installation has finished.

### 3. Download the project from GitHub

1. Create or choose a folder where you want to save the project, for example `Documents`.
2. Open that folder in File Explorer.
3. Type `cmd` in the address bar at the top and press **Enter**.
4. Type the following command and press **Enter**:

```text
git clone https://github.com/shogun1988/fotograaf.git
```

Wait for the download to finish. A new folder called `fotograaf` will appear.

> ℹ️ **What is a terminal?**  
> A terminal is a window where you can type short commands. In Windows, open a folder in File Explorer, type `cmd` in the address bar, and press **Enter**.

### 4. Open the correct folder

Open a terminal and type the command below. Then press **Enter**:

```text
cd D:\fotograaf\app
```

> ℹ️ Did you save the project somewhere else? Replace `D:\fotograaf\app` with the location of your own `app` folder.

### 5. Prepare the app

Type this command and press **Enter**:

```text
npm install
```

Wait for the command to finish. The first installation may take a few minutes.

### 6. Start the app

Then type:

```text
node server.js
```

When you see a message saying that the web app is running, everything is ready.

### 7. Open the app

Open Chrome, Edge, or another browser and go to:

**[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Log in to the app

Use these details on the login screen:

| What do you need? | Value to enter |
| --- | --- |
| Username | `demo` |
| Password | `test123test` |

> 🔒 **Tip:** Change the password after your first login through **My account**.

---

## ✨ How to use the app

After logging in, you will arrive at the dashboard. Below is a simple and logical order to get started.

### 1. Add your packages first

Go to **Packages** and add your services, for example a portrait shoot, family shoot, or wedding report. Enter the price and a short description.

### 2. Add your locations

Go to **Locations** and add places where you often take photos, such as your studio, a park, or a client location.

### 3. Add a client

Go to **Clients** and choose **New client**. Enter the name, email address, phone number, and address. Save the information.

### 4. Schedule a photo shoot

Go to **Photo shoots** and choose **New photo shoot**. Select the client, package, location, date, and time. Then save the photo shoot.

### 5. View or create an invoice

Go to **Invoices** to view unpaid and paid invoices. When a payment is received, check that the invoice status is correct.

> 💡 For a new assignment, always start by **adding the client** and then create the related **photo shoot**.

---

## ❓ Help with common questions

### The page does not open

Check whether the terminal is still open and whether you have run `node server.js` first. Then try to reload the page in your browser.

### How do I stop the app?

Return to the terminal window and press:

```text
Ctrl + C
```

### How do I start the app again later?

1. Open a terminal in the `D:\fotograaf\app` folder.
2. Type `node server.js`.
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 You normally only need to run `npm install` once: during the first installation.

### In what order should I use the app?

Use this simple order for a new assignment:

1. Add the client.
2. Schedule the photo shoot.
3. Check the photo shoot details.
4. View or create the invoice.
5. Update the photo shoot and invoice status when needed.

### How do I change my password?

1. Log in to the app.
2. Open **My account**.
3. Enter your current and new password.
4. Save the change.

---

## ℹ️ Who is this guide for?

This guide is written for people without technical or programming knowledge. You do not need to understand code: simply follow the steps in the given order.
