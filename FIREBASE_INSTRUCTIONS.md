# 如何開啟 Firebase Realtime Database 讀寫權限

為了讓「賭王大賽」可以在不同手機間連線，您需要修改資料庫的安全性規則。

1.  **進入 Firebase Console**
    *   點選左側選單的 **Build (建構)** > **Realtime Database**。

2.  **切換到規則分頁**
    *   在上方標籤列，點選 **Rules (規則)**。

3.  **修改規則**
    *   刪除編輯器中原本的內容。
    *   複製專案目錄下的 `firebase_rules.json` 檔案內容 (或下方代碼)，貼上到編輯器中：

    ```json
    {
      "rules": {
        ".read": true,
        ".write": true
      }
    }
    ```

    *(這段規則代表：允許任何人讀取和寫入資料。僅供測試使用，正式上線時這並不安全，但對目前的記分板來說最方便。)*

4.  **發布**
    *   點擊編輯器上方的 **Publish (發布)** 按鈕。

完成後，您的 `gambling-king.html` 就可以正常讀寫資料了！
