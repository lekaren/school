import express from 'express';
import Expo from 'expo-server-sdk';

const app = express();
const expo = new Expo();

const savedPushTokens = [];
const PORT_NUMBER = 3000;

const saveToken = (token) => {
    if (savedPushTokens.indexOf(token === -1)) {
        savedPushTokens.push(token);
    }
};

const handlePushTokens = (message) => {
    let notifications = [];

    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.log('에러!');
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: 'default',
            title: '급식',
            body: message,
            data: {message}
        });
    } 
    console.log(notifications)
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let reseipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(reseipts);
            } catch (error) {
                console.error(error);
              }
        }
    })();
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('서버 실행');
});

app.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log('토큰 저장됨');
    console.log(`토큰이 저장되었습니다. ${req.body.token.value}`);
});

app.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log('메시지 보냄');
    res.send(`메시지를 전송합니다. ${req.body.message}`);
});

app.listen(PORT_NUMBER, () => {
    console.log('3000번 포트로 서버 실행');
})