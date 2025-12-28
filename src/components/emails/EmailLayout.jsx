export default function EmailLayout({ children, title }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 40px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 28px; font-weight: bold; color: #f1c40f; margin-bottom: 15px;">${process.env.APP_NAME || 'Runminders'}</div>
        ${children}
      </div>
    </div>
  </body>
  </html>
  `;
}