import React, { useRef } from "react";
import S3 from "react-aws-s3";
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {
  fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");
const { S3Client, PutObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
const REGION = "us-east-1"; //REGION

const albumBucketName = "uat.asset.mintmaster.app"; //BUCKET_NAME


const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: "us-east-1:f2ea9853-7d41-45c2-852d-68793660d79d", // IDENTITY_POOL_ID
  }),
});



function Upload() {
  const fileInput = useRef();


  const addPhoto = async (event) => {
    event.preventDefault();
    let file = fileInput.current.files[0];
    let newFileName = fileInput.current.files[0].name.replace(/\..+$/, "");  try {
      const data = await s3.send(
          new ListObjectsCommand({
            Prefix: "xyz",
            Bucket: albumBucketName
          })
      );
      const fileName = newFileName;
      const photoKey = "xyz" + fileName;
      const uploadParams = {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file
      };
      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        alert("Successfully uploaded photo.");
        // viewAlbum(albumName);
      } catch (err) {
        return alert("There was an error uploading your photo: ", err.message);
      }
    } catch (err) {
      if (!fileInput.current.files.length) {
        return alert("Choose a file to upload first.");
      }
    }
  };

  // const handleClick = (event) => {
  //   event.preventDefault();
  //   let file = fileInput.current.files[0];
  //   let newFileName = fileInput.current.files[0].name.replace(/\..+$/, "");
  //   const config = {
  //     bucketName: "uat.asset.mintmaster.app",
  //     // dirName: "mintmaster" /* optional */,
  //     region: "us-east-1",
  //     accessKeyId: "AKIA6B36SBTGHSDOFB3U",
  //     secretAccessKey: "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",
  //   };
  //   const ReactS3Client = new S3(config);
  //   ReactS3Client.uploadFile(file, newFileName).then((data) => {
  //     console.log(data);
  //     if (data.status === 204) {
  //       console.log("success");
  //     } else {
  //       console.log("fail");
  //     }
  //   });
  // };
  return (
    <>
      <form className='upload-steps' onSubmit={addPhoto}>
        <label>
          Upload file:
          <input type='file' ref={fileInput} />
        </label>
        <br />
        <button type='submit'>Upload</button>
      </form>
    </>
  );
}

export default Upload;
