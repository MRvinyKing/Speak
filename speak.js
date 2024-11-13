(function() {
    if (window.location.hostname === "learn.corporate.ef.com") {
        const cookies = document.cookie.split("; ");
        const efidToken = cookies.find(cookie => cookie.startsWith("efid_tokens="));
        
        if (efidToken) {
            const tokenValue = decodeURIComponent(efidToken.split("=")[1]);
            
            // Regex para extrair o access e account
            const accessRegex = /"access":"(.*?)"/;
            const accountRegex = /"account":"(.*?)"/;
            
            const accessMatch = tokenValue.match(accessRegex);
            const accountMatch = tokenValue.match(accountRegex);

            if (accessMatch && accessMatch[1] && accountMatch && accountMatch[1]) {
                const access = accessMatch[1];
                const token = accountMatch[1];
                showTokenPopup(`${access}:${token}`);
            } else {
                console.log("Access or Token not found.");
            }
        } else {
            console.log("Cookie 'efid_tokens' not found.");
        }
    } else {
        console.log("You are not on learn.corporate.ef.com");
    }

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
            width: 320px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif; color: white; position: relative;
        `;

        // Animated RGB strip at the bottom
        const rgbStrip = document.createElement("div");
        rgbStrip.style.cssText = `
            position: absolute; bottom: 0; left: 0; width: 100%; height: 5px;
            border-radius: 0 0 8px 8px;
            background: linear-gradient(90deg, rgba(59, 175, 222, 1), rgba(202, 70, 205, 1), rgba(201, 227, 58, 1), rgba(59, 175, 222, 1));
            background-size: 300% 100%;
            animation: rgbProgress 5s linear infinite;
        `;

        // Adding smooth RGB animation
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes rgbProgress {
                0% { background-position: 0% 0; }
                100% { background-position: -300% 0; }
            }
        `;
        document.head.appendChild(styleSheet);

        // Close button styled as an "X"
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
        copyTab.innerText = "Copy Token";
        copyTab.style.cssText = `
            cursor: pointer; padding: 5px; color: #fff; flex: 1;
            text-align: center; border-bottom: 2px solid #3bafde;
        `;

        const updateTab = document.createElement("div");
        updateTab.innerText = "Update Token";
        updateTab.style.cssText = `
            cursor: pointer; padding: 5px; color: #bbb; flex: 1;
            text-align: center; border-bottom: 2px solid transparent;
        `;

        tabsContainer.appendChild(copyTab);
        tabsContainer.appendChild(updateTab);
        popupContent.appendChild(tabsContainer);

        // Sections container
        const sectionsContainer = document.createElement("div");

        // Copy Token section
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
            showNotification("Token copied successfully!");
        };
        copySection.appendChild(copyButton);
        sectionsContainer.appendChild(copySection);

        // Update Token section
        const updateSection = document.createElement("div");
        updateSection.style.display = "none";

        const newTokenInput = document.createElement("input");
        newTokenInput.type = "text";
        newTokenInput.placeholder = "New Token (access:token)";
        newTokenInput.style.cssText = `
            width: 100%; padding: 10px; font-size: 14px; text-align: center;
            margin-bottom: 15px; border: 1px solid #444; border-radius: 5px;
            background-color: #333; color: #fff;
        `;
        updateSection.appendChild(newTokenInput);

        const updateButton = document.createElement("button");
        updateButton.innerText = "Update Token";
        updateButton.style.cssText = `
            width: 100%; padding: 10px; font-size: 14px; margin-bottom: 15px;
            cursor: pointer; background-color: #ca46cd; color: #fff;
            border: none; border-radius: 5px;
        `;
        updateButton.onclick = function() {
            const newToken = newTokenInput.value;
            if (newToken && newToken.includes(":")) {
                const [access, token] = newToken.split(":");
                const tokenToSave = `access:${token}`;
                document.cookie = `efid_tokens=${encodeURIComponent(tokenToSave)}; path=/`;
                showNotification("Token updated successfully!");
            } else {
                showNotification("Invalid token format. Please use 'access:token'.", true);
            }
        };
        updateSection.appendChild(updateButton);
        sectionsContainer.appendChild(updateSection);

        popupContent.appendChild(sectionsContainer);
        popupContent.appendChild(rgbStrip);
        popupBackground.appendChild(popupContent);
        document.body.appendChild(popupBackground);

        // Toggle between sections with animation
        copyTab.onclick = () => {
            copySection.style.display = "block";
            updateSection.style.display = "none";
            copyTab.style.borderBottom = "2px solid #3bafde";
            updateTab.style.borderBottom = "2px solid transparent";
            updateTab.style.color = "#bbb";
            copyTab.style.color = "#fff";
            copySection.style.opacity = "1";
            updateSection.style.opacity = "0";
            copySection.style.transition = "opacity 0.3s ease-in-out";
            updateSection.style.transition = "opacity 0.3s ease-in-out";
        };

        updateTab.onclick = () => {
            copySection.style.display = "none";
            updateSection.style.display = "block";
            updateTab.style.borderBottom = "2px solid #ca46cd";
            copyTab.style.borderBottom = "2px solid transparent";
            copyTab.style.color = "#bbb";
            updateTab.style.color = "#fff";
            copySection.style.opacity = "0";
            updateSection.style.opacity = "1";
            copySection.style.transition = "opacity 0.3s ease-in-out";
            updateSection.style.transition = "opacity 0.3s ease-in-out";
        };
    }

    function showNotification(message, isError = false) {
        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background-color: ${isError ? "#e74c3c" : "#27ae60"}; color: white;
            padding: 10px 20px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        `;
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
})();
