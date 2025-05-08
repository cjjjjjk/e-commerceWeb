import { ProductCard, ProductCardProps } from 'shared/components/product-card/ProductCard';
import { useEffect, useState } from 'react';
import './women.css'
import { FullContent } from "shared/components"; 


function Women(){

    const productCard: ProductCardProps = {
        imageUrl: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477903/item/vngoods_50_477903_3x4.jpg?width=294",
        colors: [],
        isWishlist: false || false,
        name: "NAMENAME",
        price: "999,999",
        id: "NOTFOUND",
    }

    return (
        <>
        <div className="home-container h-100">
            <FullContent title="bộ sưu tập xuân/hè" des='Trang phục thiết yêu cho cuộc sống hiện đại' price='Chỉ từ: 350,000đ' image='https://im.uniqlo.com/global-cms/spa/res7fa45af738dac6c30bbaf4a275852a6afr.jpg'></FullContent><FullContent title="MỪNG NGÀY QUỐC TẾ PHỤ NỮ" des='Trang phục hiện đại, trẻ trung phái đẹp' image='https://im.uniqlo.com/global-cms/spa/resfa01e6896858ad4ddae21ef83d6da147fr.jpg'></FullContent>
            <FullContent title="trang phục thể thao" des='Vận động thoải mái, linh hoạt' image='https://im.uniqlo.com/global-cms/spa/res44283ce65858af9de3b4df7ff71e2013fr.jpg'></FullContent>
            <FullContent title="áo sơ mi, kiểu cách" des='Thay đổi diện mạo chào đón phong cách mới lạ' image='https://im.uniqlo.com/global-cms/spa/res3e1b5254570f1f7c717578d9c8c570d8fr.jpg'></FullContent>
            <FullContent title="Bộ sưu tập tổng hợp" des='Đa dạng bộ sưu tập'></FullContent>
        </div>
        </>
    )
}
export default Women;