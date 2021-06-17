import express from "express"
import AWS, { S3 } from "aws-sdk"
import fs from "fs"
import FileType from "file-type"
import multiparty from "multiparty"
const app = express()

// configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

// create S3 instance
const s3 = new AWS.S3()
// const uploadFile = (
//     buffer: S3.Body,
//     name: string,
//     type: { ext: string; mime: string }
// ) => {
//     params = {
//         ACL: "public-read",
//         // bucket is private, those files will have a public url
//         Body: buffer,
//         Bucket: process.env.S3_BUCKET,
//         ContentType: type.mime,
//         Key: `${name}.${type.ext}`,
//     }
//     return s3.upload(params).promise()
// }
// Define POST route
app.post("/test-upload", (request, response) => {
    alert("uploaded")
    return response.send({
        success: true,
        data:
            "https://www.google.com/search?q=pikachu&safe=active&sxsrf=ALeKk03kk8dCdl9Vze0tJELyZvVF6PY5ZQ:1623918614005&tbm=isch&source=iu&ictx=1&fir=Z_PZg83XP8JNZM%252CQF_QcLXEHnA6mM%252C_&vet=1&usg=AI4_-kQ6sHVC75U4ODWDhu6UFNub7rpMPA&sa=X&ved=2ahUKEwiYvIahoJ7xAhU1heYKHT9QDXcQ_h16BAgyEAE",
    })
    // const form = new multiparty.Form()
    // form.parse(request, async (error, fields, files) => {
    //     if (error) {
    //         return response.status(500).send(error)
    //     }
    //     try {
    //         const path = files.file[0].path
    //         const buffer = fs.readFileSync(path)
    //         const type = await FileType.fromBuffer(buffer)
    //         const fileName = `bucketFolder/${Date.now().toString()}`
    //         const data = await uploadFile(buffer, fileName, type)
    //         return response.status(200).send(data)
    //     } catch (err) {
    //         return response.status(500).send(err)
    //     }
    // })
})
