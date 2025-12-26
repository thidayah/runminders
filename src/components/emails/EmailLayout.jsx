export default function EmailLayout({ children, title }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      .body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .container {
        background-color: #ffffff;
        border-radius: 10px;
        padding: 40px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        // color: #4F46E5;
        color: #2c3f51;
        // margin-bottom: 10px;
      }
      .button {
        display: inline-block;
        // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        background: #2c3f51;
        color: white;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 8px;
        margin: 25px 0;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11);
        transition: all 0.3s ease;
      }
      .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1);
      }
      .button-secondary {
        display: inline-block;
        background-color: #DC2626;
        color: white;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 8px;
        margin: 25px 0;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
        transition: all 0.3s ease;
      }
      .button-secondary:hover {
        background-color: #B91C1C;
        transform: translateY(-2px);
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
        font-size: 14px;
        color: #666;
        text-align: center;
      }
      .token-box {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        word-break: break-all;
        margin: 20px 0;
        border: 1px solid #e0e0e0;
        font-size: 14px;
      }
      .divider {
        height: 1px;
        background: linear-gradient(to right, transparent, #e0e0e0, transparent);
        margin: 30px 0;
      }
      .social-icons {
        text-align: center;
        margin-top: 20px;
      }
      .social-icons a {
        display: inline-block;
        margin: 0 10px;
        color: #666;
        text-decoration: none;
      }
      .warning {
        background-color: #FEF3C7;
        border: 1px solid #F59E0B;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        color: #92400E;
      }
      .feature-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        border-left: 4px solid #4F46E5;
      }
    </style>
  </head>
  <body class="body">
    <div class="container">
      <div class="header">
        <div class="logo">${process.env.APP_NAME || 'Runminders'}</div>
        ${children}
      </div>
    </div>
  </body>
  </html>
  `;
}