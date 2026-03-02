# Deploying SvelteKit to Linode with Nginx

This guide outlines the steps to deploy your SvelteKit application to a Linode VPS using Nginx as a reverse proxy.

## 1. Prepare Your Application

SvelteKit projects default to `adapter-auto`. For a VPS deployment like Linode, you should use `adapter-node`.

1.  **Install the adapter**:
    ```bash
    npm install -D @sveltejs/adapter-node
    ```

2.  **Update `svelte.config.js`**:
    Change the adapter import:
    ```javascript
    import adapter from '@sveltejs/adapter-node';

    const config = {
        // ...
        kit: {
            adapter: adapter()
        }
    };

    export default config;
    ```

3.  **Build the application**:
    Run the build command locally to verify everything works:
    ```bash
    npm run build
    ```
    This will create a `build` directory (or whatever your adapter config specifies).

## 2. Server Setup (Linode)

Assuming you have a fresh Linode instance (e.g., Ubuntu 24.04 LTS):

1.  **Update system**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2.  **Install Node.js**:
    You can use `nvm` or a package manager. Here's using the NodeSource repository (for Node 20):
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

3.  **Install PM2 (Process Manager)**:
    PM2 keeps your app running and restarts it if it crashes.
    ```bash
    sudo npm install -g pm2
    ```

4.  **Install Nginx**:
    ```bash
    sudo apt install nginx
    ```

## 3. Deploy Your Code

You can transfer your code via Git (recommended) or `scp`.

**Option A: Git**
1.  Clone your repository on the server:
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```
2.  Install production dependencies:
    ```bash
    npm ci
    ```
3.  Build the app (if you didn't commit the build folder):
    ```bash
    npm run build
    ```
    *Note: If your server has low RAM, you might want to build locally and transfer the `build/` folder instead.*

## 4. Run with PM2

Start your application using PM2. SvelteKit's node adapter usually outputs `index.js` in the `build` folder.

```bash
# Start the app (change '3000' to your desired internal port if needed)
PORT=3000 pm2 start build/index.js --name "tennis-draft"

# Save the process list to restart on boot
pm2 save
pm2 startup
# (Run the command output by pm2 startup)
```

## 5. Configure Nginx

Configure Nginx to proxy traffic to your Node.js application.

1.  **Create a site configuration**:
    ```bash
    sudo nano /etc/nginx/sites-available/tennis-draft
    ```

2.  **Add the configuration**:
    Replace `your_domain.com` with your actual domain or IP address.

    ```nginx
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable the site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/tennis-draft /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default  # Optional: remove default if not used
    ```

4.  **Test and Reload Nginx**:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

## 6. SSL Configuration (Optional but Recommended)

Use Certbot to secure your site with HTTPS.

1.  **Install Certbot**:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **Obtain and install certificate**:
    ```bash
    sudo certbot --nginx -d your_domain.com -d www.your_domain.com
    ```
    Follow the prompts to redirect HTTP traffic to HTTPS.

---

That's it! Your SvelteKit app should now be live on your Linode server.
