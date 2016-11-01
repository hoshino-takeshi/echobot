var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// ボットの準備
//=========================================================

// Restifyサーバの設定
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// ボットの接続先設定
  // MicrosoftBotFramework公式サイトで取得した、IDとパスワードを入力します
//  appId: process.env.BOTFRAMEWORK_APPID, 
//  appSecret: process.env.BOTFRAMEWORK_APPSECRET 
//var connector = new builder.ChatConnector({
var connector = new builder.ChatConnector({
  appId: 'mkipp-echobotsample',
  appPassword: '0c3e0d662858416aa0a1dccf30a9c9bc'
});

// ボットの仕組みを提供してくれるUniversalBotオブジェクトを作成
var bot = new builder.UniversalBot(connector, {
    dialogErrorMessage: "すみません。認識できません。(T_T)"
});

// ***/api/messagesをエンドポイントとして、ボットをサーバで提供する
server.post('/api/messages', connector.listen());

//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================

// 認識に指定するLUIS APIのURLを指定
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=b9adde4d-3550-4c95-b453-0c9977f06bfa&subscription-key=f08bfb01b8944496855fd0f33fbaf6d4');

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
  recognizers: [recognizer]
});

//=========================================================
// 会話の処理
//=========================================================

// 初期ダイアログを、intentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents
    .matches('メーカーページへ移動', function (session, args) {
	 var resultText = "";
        // インテントが 'intentA' だったときの処理をここに記述します。
 	var area = builder.EntityRecognizer.findEntity(args.entities, 'メーカー名');
	if (area) {
//		builder.DialogAction.send('Ciscoのページはこちらです。https://mki365.sharepoint.com/sites/ba/SitePages/' + area + '.aspx'));
		resultText += 'Ciscoのページはこちらです。https://mki365.sharepoint.com/sites/ba/SitePages/' + area + '.aspx';
	}
	session.endDialog(resultText);
    })
    .onDefault(function(session){
        // 当てはまるインテントがなかったのとき(None) の処理をここに記述します。
//	builder.DialogAction.send('認識できませんでした。'))	
	session.endDialog('認識できませんでした。');	
    });

server.get(/.*/, restify.serveStatic({
    'directory': './static/',
    'default': 'index.html'
}));

//-------------------------------------------------------------------
// Get secrets from server environment
//var botConnectorOptions = { 
//    appId: process.env.BOTFRAMEWORK_APPID, 
//    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
//};

// Create bot
//var bot = new builder.BotConnectorBot(botConnectorOptions);
//bot.add('/', function (session) {
//    
//    //respond with user's message
//    session.send("あなたは" + session.message.text + "と言いました。"
//     + "トップページへは https://mki365.sharepoint.com/sites/ba からアクセスできます。");
//});

//bot.add('/', new builder.CommandDialog()
//    .onBegin(builder.DialogAction.send("こんにちは。PA Botです。情報が今どこに掲示されているのかを(分かる範囲で)お知らせします。"
//      + "キーワードを入れてください"))
//    .matches('^version', builder.DialogAction.send('PA Bot version 0.1'))
//    .matches('google', builder.DialogAction.send('http://www.google.com/'))
//    .matches('MKI', builder.DialogAction.send('http://www.mki.co.jp/'))
//    .matches('プロダクトポータル', builder.DialogAction.send('https://mki365.sharepoint.com/sites/ba/'))
//    .matches('Cisco.*価格表', builder.DialogAction.send('https://mki365.sharepoint.com/sites/ba/SitePages/Cisco価格表.aspx'))
//    .matches('Cisco', builder.DialogAction.send('https://mki365.sharepoint.com/sites/ba/SitePages/Cisco.aspx'))
//    .matches('(Microsoft|MS).*(社内利用|特典|デモ|検証|トレーニング)', builder.DialogAction.send('こちらへどうぞ→ https://mki365.sharepoint.com/sites/ba/SitePages/Microsoftパートナー特典(MPN).aspx'))
//    .matches('(Microsoft|MS)', builder.DialogAction.send('こちらへどうぞ→ https://mki365.sharepoint.com/sites/ba/SitePages/Microsoft.aspx'))
//    .onDefault(builder.DialogAction.send("認識できません。"))
//);

// Setup Restify Server
//var server = restify.createServer();

// Handle Bot Framework messages
//server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Serve a static web page
//server.get(/.*/, restify.serveStatic({
//	'directory': '.',
//	'default': 'index.html'
//}));

//server.listen(process.env.port || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
//});
