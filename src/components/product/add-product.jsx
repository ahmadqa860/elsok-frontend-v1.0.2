import React  from 'react'
import Form from '../common/form';
import Joi from "joi-browser";
import http from "../../services/httpService";
import {apiUrl} from "../../config.json";
import ProfileHeader from '../utils/profileHeader';
import ProfileSidebar from '../utils/profileSidebar';
import LoadingPage from "../utils/loadingPage";
import "../../css/add-product.css";


class AddNewProduct extends Form{

    state={
        data:{
            categorie_id:"",
            product_title:"",
            product_description:"",
            product_price:"",
            uploadImage:null, 
        },
        imagesArray:[],
        errors:{},
        categories:[],
        loading: false,
    };

    async componentDidMount(){
        const {data}  = await http.get(`${apiUrl}/categories`);
        this.setState({categories:data});
    }


    schema={
        categorie_id: Joi.required().label("Category").error(() => {
            return {
              message: 'عليك أختيار التصنيف',
            };
          }),
        product_title: Joi.string().required().label("Title").error(() => {
            return {
              message: 'أدخل العنوان',
            };
          }),
        product_description: Joi.string().required().label("Description").error(() => {
            return {
              message: 'أكتب وصف المنتج',
            };
          }),
        product_price: Joi.number().required().label("Price").error(() => {
            return {
              message: 'ضع السعر المناسب',
            };
          }),
        uploadImage:Joi.required().label("uploadImage").error(() => {
            return {
              message: 'عليك تحميل الصور',
            };
          }), 
    };

    handleSelect = (event) => {
        let categorie_id = event.target.value;
        const {data} = this.state;
        data.categorie_id = categorie_id;
        this.setState({data});
    };

    doSubmit = async () => {
        var { data } = this.state;
        let { loading } = this.state;
        loading = true;
        this.setState({loading});
        
        var bodyFormData = new FormData();

        if(data.uploadImage != null){
            for(let uploadImage of data.uploadImage){
                bodyFormData.append('uploadImages[]',uploadImage);
            }
        
            bodyFormData.append('categorie_id',data.categorie_id);
            bodyFormData.append('product_title',data.product_title);
            bodyFormData.append('product_description',data.product_description);
            bodyFormData.append('product_price',data.product_price);
        
            try{
                await http.post(`${apiUrl}/seller-products`,bodyFormData);
                this.props.history.replace("/product/my-products");
            }catch (ex) {
                const { data } = ex.response;
                const errors = data.errors;
                const err = {};
                for (const error in errors) {
                  err[error] = errors[error][0];
                }
                this.setState({ errors: err });
                loading = false;
                this.setState({loading});
                alert("خطأ في ادخال المعلومات !");
            }
        }
            else{
                alert("خطأ في ادخال الصور");
                loading = false;
                this.setState({loading});
        }
    }

    handleFileSelected=(event)=>{
        const {data} = this.state;
        let {imagesArray} = this.state;
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        
        imagesArray = selectedFilesArray.map(file=>{
            return URL.createObjectURL(file);
        });
        data.uploadImage = selectedFilesArray
        this.setState({data});
        this.setState({imagesArray});
    }


    render(){
        const {categories} = this.state;
        const {loading} = this.state;
        const {data} = this.state;
        let {imagesArray} = this.state;
        return (
    <React.Fragment>
        <ProfileHeader titleText="أضف منتوجك الى حسابك" />
        <section className="my-account-area section_padding_100_50">
                <div className="container">
                    <div className="row">
                        <ProfileSidebar />
                        <div className="col-12 col-lg-9">
                            <div className="my-account-content mb-50">
                            {!loading && (
                            <form className="Lform" onSubmit={this.handleSubmit} autoComplete="off" method="POST" encType="multipart/form-data">
                                <select
                                    name="categorie_id"
                                    id="categorie_id"
                                    className="custom-select form-group"
                                    onChange={this.handleSelect}
                                    
                                    >
                                    <option defaultValue="">أختار التصنيف</option> 
                                        {categories.map((category)=>(
                                            <option key={category.id} value={category.id}>{category.categorie_title}</option> 
                                        ))} 
                                </select>
                                <div className="form-group images">
                                    <label htmlFor="images">ادخال الصور</label> 
                                                         
                                        <input
                                            type='file'
                                            name='images'
                                            onChange={this.handleFileSelected}
                                            multiple
                                            accept='image/png , image/jpeg , image/webp'
                                            />
                                         <div className="images">
                                            {imagesArray &&
                                                imagesArray.map((image, index)=>{
                                                    
                                                    let removeImage = 0;
                                                    return (
                                                        <div key={index} className="image">
                                                            <img src={image} alt={image} height="200px" width="200px"/>
                                                            <button onClick={()=>{
                                                                
                                                                imagesArray = imagesArray.filter(e => e!==image);
                                                                removeImage = data.uploadImage[index];
                                                                data.uploadImage = data.uploadImage.filter(e => e!==removeImage);
                                                                this.setState({imagesArray});
                                                                this.setState({data});
                                                            }}>delete image</button>
                                                        </div>
                                                    )
                                                })

                                            }
                                            </div>
                                </div>
                                {this.renderInput("product_title", "عنوان المنتج")}
                                {this.renderTextarea("product_description", "شرح وتفصيل عن المنتج")}
                                {this.renderInput("product_price", "السعر")}
                                
                                {this.renderButton("أنتهاء")} 
                            </form>
                            )}

                            {loading && (<LoadingPage/>)}
                    
                    </div>
                </div>
                </div>
                </div>
            </section>
        </React.Fragment>
        )
    }

}

export default AddNewProduct;