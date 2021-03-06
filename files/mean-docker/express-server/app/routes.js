var Todo = require('./models/todo');
var Client = require('./models/client');
var Record = require('./models/record');
var Account = require('./models/account')
function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};
module.exports = function (app) {
    // 测试
    app.get('/todos', function (req, res) {
        getTodos(res)
    });

    // api ---------------------------------------------------------------------
    // get all todos
    //获取所有client信息
    app.get('/client', (req, res) =>{
        Client.find({}).then(clients=>{
            res.json(clients);
        })
        .catch(err=>{
            console.log('err');
            res.json(err);
        })
        // use mongoose to get all todos in the database
        // getTodos(res);
    });
    //获取单个client信息
    app.get('/client/private',(req,res)=>{
        Client.find({clientID:req.query.id}).then(client=>{
            res.json(client);
        }).catch(err=>{
            res.json(err);
        })
    });

        
    // create todo and send back all todos after creation
    //增加新客户
    app.post('/client', (req, res) => {
        // 查询并设置id
        let tempID=0;
        let tempdata={};

        Client.count({},(err,clientcout)=>{
            tempID=clientcout+1
        }).then((err,resGroup)=>{

            // 通过聚合函数拿到最大的id
            
            tempdata=req.query;
            tempdata.clientID=tempID

            Client.create(tempdata,(err,createClient)=>{
                if(err){
                    res.send('err1');
                }else{
                    Client.find(function (err, client) {
        
                        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                        if (err) {
                            res.send('err2');
                        }
                
                        res.json(client); // return all todos in JSON format
                    });
                }
                });  
        })
    });
    //更新个人信息
    app.put("/client/modify",(req,res)=>{
        let tempClient={}
        // tempClient为所查询的id对应的人的数据
        Client.find({clientID:req.query.id}).then(client=>{
            // res.json(client);
            tempClient=client;
        }).catch(err=>{
            console.log('err')
            res.json(err);
        })

        Client.update(
            {clientID:req.query.id},
            {
                name:req.query.name,
                birthdate:req.query.birthdate,
                address:req.query.address,
                occupation:req.query.occupation,
            },
            { 
                new:true
            }
        ).then(client=>res.json(client))
        .catch(err=>res.json(err));
    });
    //修改密码
    app.put("/client/modifyPassword",(req,res)=>{
        Client.update(
            {clientID:req.query.id},
            {
                
                    password:req.query.password,
                
            },
            {
                new:true
            }).then(client=>res.json(client))
            .catch(err=>res.json(err));
    });

    // 删除客户信息
    app.delete('/client/:id', (req, res)=> {
        Client.findByIdAndRemove({
            _id: req.params.id
        }).then(client=>{client.save().then(client=>{
            res.json(client);
        })
    }).catch(err=>{
        return res.status(404).json(err);
    })
    });
    // application原本的agular输出前端模板 -------------------------------------------------------------
    // app.get('*', function (req, res) {
    //     res.sendFile(__dirname + '/public/dist/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    // });


    // record api-------------------------------------------------------------------------------------------------
    //获取所有record信息
    app.get('/record',(req,res)=>{
        Record.find({}).then(records=>{
            res.json(records);
        })
        .catch(err=>{
            console.log('err');
            res.json(err);
        })
    });
    //获取单个record信息
    app.get('/record/private',(req,res)=>{
        Record.find({transitionID: req.query.id}).then(record=>{
            res.json(record);
        }).catch(err=>{
            res.json(err);
        })
    });
    //增加新record
    app.post('/record', (req, res) => {
        // 查询并设置transitionID
        let tempID=0;
        let tempdata={};

        Record.count({}, (err, res)=>{
            if (err) {
                console.log("Error:" + err);
            }
            else {
                console.log("Res:" + res);
                tempID=res+1;
            }
        }).then(()=>{
            // count函数查询为异步操作
            tempdata=req.query;
            tempdata.transitionID=tempID;

           Record.create(tempdata,(err,ers)=>{
                if(err){
                    res.send('err1');
                }else{
                    Record.find(function (err, record) {
        
                        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                        if (err) {
                            res.send('err2');
                        }
                
                        res.json(record); // return all records in JSON format
                    });
                }
            });    
        })
    });
    app.delete('/record/:id', (req, res)=> {
        Record.findByIdAndRemove({
            _id: req.params.id
        }).then(record=>{record.save().then(record=>{
            res.json(record);
        })
    }).catch(err=>{
        return res.status(404).json(err);
    })
    });
    // account
    //获取所有account信息
    app.get('/account',(req,res)=>{
        Account.find({}).then(accounts=>{
            res.json(accounts);
        })
        .catch(err=>{
            console.log('err');
            res.json(err);
        })
    });
    //获取一个account的信息
    app.get('/account/private',(req,res)=>{
        Account.find({clientID:req.query.id}).then(account=>{
            res.json(account);
        }).catch(err=>{
            res.json(err);
        })
    });
    //创建新卡
    app.post('/account', (req, res) => {
        // 查询并设置id
        let tempID=0;
        let tempdata={};

        Account.count({}, (err, res)=>{
            if (err) {
                console.log("Error:" + err);
            }
            else {
                console.log("Res:" + res);
                tempID=res+1;
            }
        }).then(()=>{
            // count函数查询为异步操作
            tempdata=req.query;
            tempdata.accountID=tempID;

            Account.create(tempdata,(err,ers)=>{
                if(err){
                    res.send('err1');
                }else{
                    Account.find(function (err, account) {
        
                        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                        if (err) {
                            res.send('err2');
                        }
                
                        res.json(account); // return all todos in JSON format
                    });
                }
            });    
        })       
    });
    //创建新卡 
    // app.post('/account', (req, res) => {
    //     // 随机生产id
    //     //花花改成了随机生成accountid
    //     let number=Math.floor(Math.random()*90000);
    //     let balance=0;
    //     let tempdata={};
    //     tempdata=req.query;
    //     tempdata.accountID=number;
    //     Account.create(tempdata, (err,res) =>{
    //         if(err){
    //             res.send('err1');
    //         }else{
    //             Account.find(function (err, account) {
    
    //                 // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //                 if (err) {
    //                     res.send('err2');
    //                 }
            
    //                 res.json(account); 
    //             });
    //         }
    //     });
    // })

    app.put("/account/delete",(req,res)=>{
        Account.update(
            {accountID:req.query.id},
            {
                
                    flag: true
                
            },
            {
                new:true
            }).then(account=>res.json(account))
            .catch(err=>res.json(err));
    });
    //存款 用accountID查
    app.post("/account/deposit",function (req,res){
        Account.find({'accountID':req.query.id},function(err,results){
            if(Boolean(results[0].flag)==true){
                res.send("没有这个账号啊");
                return;
            }
            if (err){
                console.log(err);
                res.status(500).json(err);
            }
            let tempdata=Number(results[0].balance)+Number(req.query.balance);
            Account.findOneAndUpdate({'accountID':req.query.id},{'balance':tempdata},function(err,updateResults){
                // console.log(updateResults)
                if (err){
                    console.log(err);
                    res.status(500).send({'err':err});
                }
            });
        }).then(()=>{
            Account.find({'accountID':req.query.id},function(err,results){
                
                res.status(200).send(results);     

            })
        });
    });
    //取款 用accountID查
    app.post('/account/withdraw',function (req,res){
        Account.find({'accountID':req.query.id},function(err,results){
            if(Boolean(results[0].flag)==true){
                res.send("没有这个账号啊");
                return;
            }
            if (err){
                console.log(err);
                res.status(500).json(err);
            }
            let tempdata=Number(results[0].balance)-Number(req.query.balance);
            if (tempdata>=0){
            Account.findOneAndUpdate({'accountID':req.query.id},{'balance':tempdata},function(err,results){
                if (err){
                    console.log(err);
                    res.status(500).send({'err':err});
                }
            });
        }
            else {
                res.send("你的钱不够啊");
                return;
            }
        }).then(()=>{
            Account.find({'accountID':req.query.id},function(err,results){
                res.status(200).send(results);     
            })

        });
    });
        // //创建新卡
    // app.post('/account', (req, res) => {
    //     // 查询并设置id
    //     let tempID=0;
    //     let tempdata={};

    //     Account.count({}, (err, res)=>{
    //         if (err) {
    //             console.log("Error:" + err);
    //         }
    //         else {
    //             console.log("Res:" + res);
    //             tempID=res+1;
    //         }
    //     }).then(()=>{
    //         // count函数查询为异步操作
    //         tempdata=req.query;
    //         tempdata.accountID=tempID;

    //         Account.create(tempdata,(err,res)=>{
                // if(err){
                //     res.send('err1');
                // }else{
                //     Client.find(function (err, account) {
        
                //         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                //         if (err) {
                //             res.send('err2');
                //         }
                
                //         res.json(account); // return all todos in JSON format
    //                 });
    //             }
    //         });    
    //     })       
    // });
/*     app.delete('/account/:id', (req, res)=> {
       Account.findByIdAndRemove({
            _id: req.params.id
        }).then(account=>{account.save().then(account=>{
            res.json(account);
        })
    }).catch(err=>{
        return res.status(404).json(err);
    })
    });
 */
}