战网主要的登录接口是

POST
`https://www.battlenet.com.cn/login/zh/?ref=https://www.battlenet.com.cn/oauth/authorize?client_id%3Dnetease-d3-site%26response_type%3Dcode%26scope%3Did%2Bbattletag%2Blogout%26redirect_uri%3Dhttps%253A%252F%252Faccount.bnet.163.com%252Fbattlenet%252Flogin%253Finner_client_id%253Dow%2526inner_redirect_uri%253Dhttp%25253A%25252F%25252Fow.blizzard.cn%25252Fbattlenet%25252Flogin%25253Fredirect_url%25253Dhttp%2525253A%2525252F%2525252Fow.blizzard.cn%2525252Fcareer%2525252F&app=oauth`

参数：
*   accountName ： 用户名，例如12345@qq.com
*   password    ： 密码用.占位，例如密码是123456，password就是......
*   useSrp      ： true
*   publicA、clientEvidenceM1 ： 自己生成，参考login.js和srp.js。
*   persistLogin    ： on
*   csrftoken、sessionTimeout在html上有
*   fp  ：这个取`{"0":"3Lt4o","1":"Bv0cj1","2":"CEURno","3":"CJVngg","4":"pmXLX","5":"BEejbW","6":"Cc0zV2","7":"A","10":"DVYZ4X","11":"DXpz63","12":"RRWlR"}`就可以了

