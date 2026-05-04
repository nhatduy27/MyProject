(async function checkForUpdates() {
    const currentVersion = "1.0";
    const versionUrl = "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json"; 

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) {
            console.warn("Could not fetch version information.");
            return;
        }
        const data = await response.json();
        const latestVersion = data.version;
        const updateMessage = data.updateMessage;

        if (currentVersion !== latestVersion) {
            alert(updateMessage);
        } else {
            console.log("You are using the latest version.");
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
})();


const messages = [
    "Em chắc chưa đó? 😏",
    "Chắc thiệt luôn á hả?? 😳",
    "Không đổi ý được hả ta...?",
    "Kim ơi nghĩ lại đi mà 🥺",
    "Ủa anh thấy dễ thương vcl mà...😭",
    "Hong giỡn à nhaaaa",
    "Vẫn hong chịu luôn á haaaaaa"
];

let messageIndex = 0;

// ========== THÊM MỚI: Danh sách GIF cố định ==========
const gifList = [
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWxlcGRweTM0NzkybjQ3bHhmYWdmbjd3ZHhxeGJzY2l2OTA5djhwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VM1fcpu2bKs1e2Kdbj/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmc0ZzY3M2Y1ZnRqYmVpd3FncGI1cTFoaXM0aHB2b3ZtM3diOXVvdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/iapHPgb3funNMt4OCO/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWZvbWNmb2FlbnV1YXNhcDRxczdiZno4Y3FpbDBnd2Y4OWhwazRpeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/UmthO5muTl9jh0GcDQ/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzgydHppeW5kZDJ4eGFreWpieWR5dGdkaW91d2VzaDVmZ3ZraTN0aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/QlQdLBS70XJcZY1fLF/giphy.gif",
    
];

let gifIndex = 0;

function handleNoClick() {
    // Code cũ giữ nguyên
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
    
    // ========== THÊM MỚI: Đổi GIF mỗi lần nhấn ==========
    const gifImg = document.querySelector('.gif_container img');
    gifIndex = (gifIndex + 1) % gifList.length;
    gifImg.src = gifList[gifIndex];
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}