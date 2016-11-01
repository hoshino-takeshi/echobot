var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var botConnectorOptions = { 
    appId: process.env.BOTFRAMEWORK_APPID, 
    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
};

// Create bot
var bot = new builder.BotConnectorBot(botConnectorOptions);
//bot.add('/', function (session) {
//    
//    //respond with user's message
//    session.send("あなたは" + session.message.text + "と言いました。"
//     + "トップページへは https://mki365.sharepoint.com/sites/ba からアクセスできます。");
//});

bot.add('/', new builder.CommandDialog()
    .onBegin(builder.DialogAction.send("こんにちは。PA Botです。情報が今どこに掲示されているのかを(分かる範囲で)お知らせします。"
      + "キーワードを入れてください"))
    .matches('^version', builder.DialogAction.send('PA Bot version 0.1'))
    .matches('google', builder.DialogAction.send('http://www.google.com/'))
    .matches('MKI', builder.DialogAction.send('http://www.mki.co.jp/'))
    .matches('プロダクトポータル', builder.DialogAction.send('https://mki365.sharepoint.com/sites/ba/'))
    .matches('Cisco.*価格表', builder.DialogAction.send('https://mki365.sharepoint.com/sites/ba/SitePages/Cisco価格表.aspx'))
    .matches('Cisco', builder.DialogAction.send('https://mki365.sharepoint.com/sites/ba/SitePages/Cisco.aspx'))
    .matches('(Microsoft|MS).*(社内利用|特典|デモ|検証|トレーニング)', builder.DialogAction.send('こちらへどうぞ→ https://mki365.sharepoint.com/sites/ba/SitePages/Microsoftパートナー特典(MPN).aspx'))
    .matches('(Microsoft|MS)', builder.DialogAction.send('こちらへどうぞ→ https://mki365.sharepoint.com/sites/ba/SitePages/Microsoft.aspx'))
    .onDefault(builder.DialogAction.send("認識できません。"))
);

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
