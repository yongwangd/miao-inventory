import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return false;
  //   return isJPG && isLt2M;
}

class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.state = {
      imageUrl: null,
      imageLink: props.imageLink
    };
    this.onDelete = this.onDelete.bind(this);
  }

  onFileChange(e) {
    const { onFileSelect } = this.props;
    e.preventDefault();
    const file = e.target.files[0];
    // getBase64(e.target.files[0], imageUrl => this.setState({
    // 		file,
    // 		imageUrl
    // }));

    onFileSelect && onFileSelect(file);
  }

  onDelete() {
    const { onDeleteFile } = this.props;
    // this.setState({file: null, imageUrl: null})
    onDeleteFile();
  }

  render() {
    const { imageUrl, imageLink } = this.state;
    const { onFileChange, onDelete } = this;
    const { buttonText = 'Click to Upload', imageSrc } = this.props;

    return (
      <div>
        <input
          style={{ display: 'none' }}
          type="file"
          ref={input => (this.fileInput = input)}
          onChange={onFileChange}
        />
        {imageSrc ? (
          <img
            onClick={() => this.fileInput.click()}
            src={imageSrc}
            alt=""
            className="avatar"
          />
        ) : (
          <Button onClick={() => this.fileInput.click()}>
            <Icon type="upload" /> {buttonText}
          </Button>
        )}
        {imageSrc && (
          <Button type="danger" onClick={onDelete}>
            Remove Image
          </Button>
        )}
      </div>
    );
  }
}

export default ImageUploader;

//   <Upload
//     className="ImageUploader-uploader"
//     name="avatar"
//     showUploadList={false}
//     action="//jsonplaceholder.typicode.com/posts/"
//     beforeUpload={beforeUpload}
//     onChange={this.handleChange}
//   >
//     {
//       imageUrl ?
//         <img src={imageUrl} alt="" className="avatar" /> :
//         <Icon type="plus" className="avatar-uploader-trigger" />
//     }
//   </Upload>
