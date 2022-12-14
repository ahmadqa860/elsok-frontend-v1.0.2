import React from 'react'
import { Link } from 'react-router-dom';
import {storageUrl} from '../../config.json';

const Product =(props)=>{
    /* const {valid} = this.props; */
    const {data,validUser,currentCategoryUrl} = props.props;
    
    const products = data.map((product)=>(
        <div key={product.id} className="col-9 col-sm-12 col-md-6 col-lg-4">
            <div className="single-product-area mb-30">
                <div className="product_image">
                                        
                     <img className="normal_img" width='300px' height='450px' src={`${storageUrl}/${product.images[0].img_src}`} alt=""/>
                    <img className="hover_img" width='300px' height='450px' src={`${storageUrl}/${product.images[0].img_src}`}  alt=""/>
 
                                        
                    {/* <div className="product_badge">
                        <span>New</span>
                    </div> */}

                                        
                    <div className="product_wishlist">
                        <Link to="#"><i className="icofont-heart"></i></Link>
                    </div>

                                        
                    {/* <div className="product_compare">
                        <a href="compare.html"><i className="icofont-exchange"></i></a>
                    </div> */}
                </div>

                                    
                <div className="product_description">
                    {validUser && (
                    <React.Fragment>
                    <div className="product_add_to_cart">
                        <Link to={`/product/edit-product/${product.id}`}><i className="fa fa-eye"></i> تعديل</Link>
                    </div>
                                    
                    <div className="product_quick_view">
                        <Link to="#" data-toggle="modal" data-target="#quickview"><i className="icofont-eye-alt"></i> حذف</Link>
                    </div>
                    </React.Fragment>
                    )}
                    {!validUser && (
                        <div className="product_quick_view">
                        <Link to={`/categories/${currentCategoryUrl}/product/${product.id}`} href={`/categories/${currentCategoryUrl}/product/${product.id}`} /* data-toggle="modal" data-target="#quickview" */><i className="icofont-eye-alt"></i> عرض المنتج</Link>
                    </div>
                    )} 
                     <p className="brand_name">{product.product_title}</p>
                     {/* <p className="brand_name"><Link className="brand_link" to={`/categories/${currentCategoryUrl}/product/${product.id}`} href={`/categories/${currentCategoryUrl}/product/${product.id}`}>{product.product_description}</Link></p>*/}
                    </div>
                </div>
            </div>
    ));

    return (products);
}

export default Product;
    
