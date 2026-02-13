export const getContactEmailTemplate = (firstName, lastName, email, subject, message) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .email-container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                padding: 30px;
                text-align: center;
                color: white;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.5px;
            }
            .content {
                padding: 40px;
                line-height: 1.6;
                color: #374151;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 100px 1fr;
                gap: 10px;
                margin-bottom: 30px;
                background-color: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #f3f4f6;
            }
            .label {
                font-weight: 700;
                color: #6b7280;
                font-size: 14px;
                text-transform: uppercase;
            }
            .value {
                color: #111827;
                font-weight: 500;
            }
            .message-box {
                background-color: #ffffff;
                border-left: 4px solid #6366f1;
                padding: 20px;
                margin-top: 20px;
                font-style: italic;
                color: #4b5563;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
            }
            .footer {
                padding: 20px;
                text-align: center;
                background-color: #f3f4f6;
                color: #9ca3af;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>New Message from Habitica </h1>
            </div>
            <div class="content">
                <p>You have received a new message through the contact form.</p>
                
                <div class="info-grid">
                    <div class="label">From:</div>
                    <div class="value">${firstName} ${lastName}</div>
                    
                    <div class="label">Email:</div>
                    <div class="value">${email}</div>
                    
                    <div class="label">Subject:</div>
                    <div class="value">${subject || 'No Subject'}</div>
                </div>
                
                <p><strong>Message Content:</strong></p>
                <div class="message-box">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Learnzy AI. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};
