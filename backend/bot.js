const axios=require('axios');
const FormData=require('form-data');
const path=require('path');
const fs=require('fs');

const convert=async (msg)=>{
    if(msg.content.startsWith('!file')){
        if (msg.author.bot) return;

        if (msg.attachments.size > 0) {
            msg.attachments.forEach(async (attachment) => {
                const fileResponse = await axios.get(attachment.url, { responseType: 'arraybuffer' });
                const formData = new FormData();

                formData.append('file', fileResponse.data,attachment.name.split('.')[0]);             

                try {
                    await axios.post(
                    "http://localhost:5000/convertByLaw",
                    formData,
                    {
                        responseType: "blob",
                    });

                    const url=`http://localhost:5000/download/${attachment.name.split('.')[0]}.pdf`;
                    console.log(url);

                    msg.channel.send('Download Link : '+url);
                } catch (error) {
                    console.log(error);
                    msg.channel.send('Error in converting file');
                }
            });
        }
        else{
            msg.channel.send('Please upload a file');
        }
    }
}

module.exports={convert};