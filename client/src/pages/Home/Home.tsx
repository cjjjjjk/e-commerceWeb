import './home.css'
import { FullContent } from "../../shared/components"; 

function Home(){

    return (
        <div className="home-container h-100">
            <FullContent title="BST 4 MÙA" des='nam và nữ' price='350,000đ' image='https://im.uniqlo.com/global-cms/spa/res7fa45af738dac6c30bbaf4a275852a6afr.jpg'></FullContent>
            <FullContent title="MỪNG NGÀY QUỐC TẾ PHỤ NỮ"></FullContent>
            <FullContent title="Bộ sưu tập 4"></FullContent>
            <FullContent title="Bộ sưu tập"></FullContent>
        </div>
    )
}
export default Home;