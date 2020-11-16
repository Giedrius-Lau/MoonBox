import React, { Fragment, useState } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState("");
    const [uploadedFile, setUploadedFile] = useState({});
    const [uploadPercentage, setUploadePercentage] = useState(0);

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/api/profile/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-tada",
                },
                onUploadProgress: (ProgressEvent) => {
                    setUploadePercentage(
                        parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total))
                    );
                    setTimeout(() => {
                        setUploadePercentage(0);
                    }, 5000);
                },
            });

            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });
        } catch (error) {
            if (error.response.status === 500) {
                console.log("There was a problem with the server");
            } else {
                console.log(error.response.data.msg);
            }
        }
    };

    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                {uploadPercentage > 0 &&
                <ProgressBar now={uploadPercentage} label={`${uploadPercentage}%`} />}
                <div className="form-group">
                    <input type="file" placeholder="image" name="file" onChange={onChange} />
                </div>
                <p>{fileName}</p>
                <button className="btn" type="submit">
                    Upload image
                </button>
                {uploadedFile.filePath && <img src={uploadedFile.filePath} alt="profile"></img>}
            </form>
        </Fragment>
    );
};

export default FileUpload;
