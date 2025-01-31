(function() {

    if (window.location.hostname === "learn.corporate.ef.com") {
        const cookies = document.cookie.split("; ");
        const efidToken = cookies.find(cookie => cookie.startsWith("efid_tokens="));
        
        if (efidToken) {
            const tokenValue = decodeURIComponent(efidToken.split("=")[1]);
            
            // Regex for extract access and account values
            const accessRegex = /"access":"(.*?)"/;
            const accountRegex = /"account":"(.*?)"/;
            
            const accessMatch = tokenValue.match(accessRegex);
            const accountMatch = tokenValue.match(accountRegex);

            if (accessMatch && accessMatch[1] && accountMatch && accountMatch[1]) {
                const access = accessMatch[1];
                const token = accountMatch[1];
                showTokenPopup(`${access}:${token}`);
            } else {console.log("Access or Token not found.");}
        } else {console.log("Cookie 'efid_tokens' not found.");}
    } else {console.log("You are not on learn.corporate.ef.com");
        showPopup("Acreditamos que você esteja no site incorreto.", "Clique aqui para abrir mesmo assim", () => {
            showTokenPopup("Não encontramos seu token, verifique seu login ou se está no site correto!");
        });
    }
    
    
        // shows popup
        function showPopup(title, message, callback) {
            // background
            const popup = createPopupBackground();
            const content = createPopupContent();
    
            // titel
            const popupTitle = document.createElement("h3");
            popupTitle.innerText = title;
            popupTitle.style.cssText = "text-align: center; color: white; margin-bottom: 10px;";
            content.appendChild(popupTitle);
    
            // popup message
            const popupMessage = document.createElement("p");
            popupMessage.innerText = message;
            popupMessage.style.cssText = "text-align: center; color: white; margin-bottom: 20px;";
            content.appendChild(popupMessage);
    
            // button callback
            const button = document.createElement("button");
            button.innerText = "Abrir mesmo assim";
            button.style.cssText = "display: block; margin: 0 auto; padding: 10px; background-color: #3bafde; color: white; border: none; border-radius: 5px; cursor: pointer;";
            button.onclick = function() {
                callback();
                document.body.removeChild(popup); 
            };
            content.appendChild(button);
    

            const closeButton = document.createElement("span");
            closeButton.innerText = "✕";
            closeButton.style.cssText = "position: absolute; top: 10px; right: 10px; font-size: 20px; color: #999; cursor: pointer;";
            closeButton.onclick = function() {
                document.body.removeChild(popup);
            };
            content.appendChild(closeButton);
            popup.appendChild(content);
            //popup.appendChild(rgbStrip);
            document.body.appendChild(popup);
        }
        
        function createPopupBackground() {
            const popupBackground = document.createElement("div");
            popupBackground.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.7); z-index: 9999; display: flex;
                justify-content: center; align-items: center;
            `;
            return popupBackground;
        }
    
        function createPopupContent() {
            const content = document.createElement("div");
            content.style.cssText = `
                background-color: #2c2c2c; padding: 30px; border-radius: 8px; 
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                width: 300px;
                text-align: center;
                position: relative;
            `;
            return content;
        }

    // main bellow 
    
    function showTokenPopup(token) {
        // Background overlay
        const popupBackground = document.createElement("div");
        popupBackground.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.7); display: flex;
            justify-content: center; align-items: center; z-index: 1000;
        `;

        // Popup container
        const popupContent = document.createElement("div");
        popupContent.style.cssText = `
            background-color: #2c2c2c; padding: 20px; border-radius: 8px;
            width: 350px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif; color: white; position: relative;
        `;

        // Close button
        const closeButton = document.createElement("span");
        closeButton.innerText = "✕";
        closeButton.style.cssText = `
            position: absolute; top: 12px; right: 12px; font-size: 14px;
            cursor: pointer; color: #999;
        `;
        closeButton.onclick = function() {
            document.body.removeChild(popupBackground);
        };
        popupContent.appendChild(closeButton);
        
        // Animated RGB strip
        const rgbStrip = document.createElement("div");
        rgbStrip.style.cssText = `
            position: absolute; bottom: 0; left: 0; width: 100%; height: 5px;
            border-radius: 0 0 8px 8px;
            background: linear-gradient(90deg, rgba(59, 175, 222, 1), rgba(202, 70, 205, 1), rgba(201, 227, 58, 1), rgba(59, 175, 222, 1));
            background-size: 300% 100%;
            animation: rgbProgress 5s linear infinite;
        `;

        // Adding RGB animation
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes rgbProgress {
                0% { background-position: 0% 0; }
                100% { background-position: -300% 0; }
            }
        `;
        document.head.appendChild(styleSheet);

        // Popup title
        const title = document.createElement("h3");
        title.innerText = "Token Manager";
        title.style.cssText = `
            text-align: center; margin-bottom: 15px; font-size: 18px;
            font-weight: bold; color: #ffffff;
        `;
        popupContent.appendChild(title);

        // Tabs navigation
        const tabsContainer = document.createElement("div");
        tabsContainer.style.cssText = `
            display: flex; justify-content: space-around; margin-bottom: 10px;
        `;

        const copyTab = document.createElement("div");
        copyTab.innerText = "Copiar Token";
        copyTab.style.cssText = `
            cursor: pointer; padding: 5px; color: #fff; flex: 1;
            text-align: center; border-bottom: 2px solid #3bafde;
        `;

        const discordTab = document.createElement("div");
        discordTab.innerText = "Nosso Discord";
        discordTab.style.cssText = `
            cursor: pointer; padding: 5px; color: #bbb; flex: 1;
            text-align: center; border-bottom: 2px solid transparent;
        `;

        tabsContainer.appendChild(copyTab);
        tabsContainer.appendChild(discordTab);
        popupContent.appendChild(tabsContainer);
        popupContent.appendChild(rgbStrip);

        // Sections container
        const sectionsContainer = document.createElement("div");

        // Copy Token tab
        const copySection = document.createElement("div");
        copySection.style.display = "block";

        const tokenText = document.createElement("input");
        tokenText.type = "text";
        tokenText.value = token;
        tokenText.readOnly = true;
        tokenText.style.cssText = `
            width: 100%; padding: 10px; font-size: 14px; text-align: center;
            margin-bottom: 15px; border: 1px solid #444; border-radius: 5px;
            background-color: #333; color: #fff;
        `;
        copySection.appendChild(tokenText);

        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy Token";
        copyButton.style.cssText = `
            width: 100%; padding: 10px; font-size: 14px; margin-bottom: 15px;
            cursor: pointer; background-color: #3bafde; color: #fff;
            border: none; border-radius: 5px;
        `;
        copyButton.onclick = function() {
            navigator.clipboard.writeText(tokenText.value);
            showNotification("Token copiado com sucesso!");
        };
        
        copySection.appendChild(copyButton);
        sectionsContainer.appendChild(copySection);

        // Discord section
        const discordSection = document.createElement("div");
        discordSection.style.display = "none";
        discordSection.style.position = "relative";
        
        const discordWidget = document.createElement("iframe");
        discordWidget.src = "https://discord.com/widget?id=1307176076300255292&theme=dark";
        discordWidget.width = "100%";
        discordWidget.height = "500";
        discordWidget.style.border = "none";
        discordWidget.allowTransparency = true;
        discordWidget.sandbox = "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts";
        discordWidget.style.zIndex = "2";
        
        // error message
        const errorMessage = document.createElement("p");
        errorMessage.innerHTML = `Não conseguimos carregar o Discord, mas você pode entrar por aqui: <a href="https://discord.gg/md2HtvUAbX" target="_blank" style="color: #3bafde;">Entrar</a>`;
        errorMessage.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 14px;
            text-align: center;
            z-index: 1; /* bellow widget */
            margin-top: 10px;
        `;


        discordSection.appendChild(discordWidget);
        //discordSection.appendChild(errorMessage);
        sectionsContainer.appendChild(discordSection);
        
        


        popupContent.appendChild(sectionsContainer);
        popupBackground.appendChild(popupContent);
        popupContent.appendChild(rgbStrip);
        document.body.appendChild(popupBackground);

        // Toggle between tabs
        copyTab.onclick = () => {
            copySection.style.display = "block";
            discordSection.style.display = "none";
            copyTab.style.borderBottom = "2px solid #3bafde";
            discordTab.style.borderBottom = "2px solid transparent";
            discordTab.style.color = "#bbb";
            copyTab.style.color = "#fff";
        };

        discordTab.onclick = () => {
            copySection.style.display = "none";
            discordSection.style.display = "block";
            discordTab.style.borderBottom = "2px solid #ca46cd";
            copyTab.style.borderBottom = "2px solid transparent";
            copyTab.style.color = "#bbb";
            discordTab.style.color = "#fff";
        };
        
    }
    // Notify event
    function showNotification(message, isError = false) {
        // Notify
        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed; top: 40px; right: 20px; 
            background-color: ${isError ? "#e74c3c" : "#27ae60"}; color: white;
            padding: 10px 20px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
            z-index: 1000;
        `;
        notification.innerText = message;
        document.body.appendChild(notification);
    
        // timeout
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
})();
