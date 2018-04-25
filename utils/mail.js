'USE STRICT'

let nodemailer	= require('nodemailer'),
    auth = {},
    transport;


function sendMail(params)
{
  return new Promise((resolve, reject)=>
  {
    if (!params || !params.to)
      return (reject('Destinater not provided'));

    auth.user = params.user || process.env.MAIL_ADDRR;
    auth.pass = params.pass || process.env.MAIL_PASS;


    transport = nodemailer.createTransport({
      service: 'Gmail',
      auth
    });

    transport.sendMail({params}, function(err, response)
    {
      console.log(err)
        if (err)
            return (reject(err));

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
      params['from'] = params['from'] || "kacoulib ✔ <hypertube@42.fr>";

      return sendMail(params)
      .then(res => resolve(res))
      .catch(err => reject(err));
    })
  }, 

  sendMail: sendMail
}
