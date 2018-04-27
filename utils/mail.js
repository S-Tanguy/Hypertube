'USE STRICT'

let nodemailer	= require('nodemailer'),
    auth = {},
    transport;


function sendMail(params)
{
  return new Promise((resolve, reject)=>
  {
    //if (!params || !params.to)
    //{
    //  return (reject('Destinater not provided'));
    //}

  //  auth.user = params.user || process.env.MAIL_ADDRR;
  //  auth.pass = params.pass || process.env.MAIL_PASS;


    transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: 'aelharim42@gmail.com', // generated ethereal user
            pass: 'matcha42' // generated ethereal password
        }
    });

    transport.sendMail(params, function(err, response)
    {
        if (err)
        {
          return (reject({err, toto: "eiofhweiugfewiu"}));
        }

        transport.close();

        return (resolve(response));
    });
  })
}


module.exports =
{
  reset_pass: (reset_key, params) =>
  {    
    return new Promise((resolve, reject)=>
    {
      if (!reset_key)
        return (reject('reset key not found'));

      params['html'] = params['html'] || "<b><a href='http://localhost:4200/pass_reset/"+ reset_key +"'>Link ✔</a></b>";
      params['subject'] = params['subject'] || "Matcha password reset";
      params['from'] = params['from'] || "PDG ✔ <aelharim42@gmail.com>";

      return sendMail(params)
      .then(res => resolve("ok"))
      .catch(err => {reject(err); console.log("2165844864")});
    })
  },

  sendMail: sendMail
}
