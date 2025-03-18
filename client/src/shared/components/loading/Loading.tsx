import './loading.css'

interface LoadingProps {
    message?: string
}
const Loading=({message}: LoadingProps)=> {

    return (
        <div className='loading-container position-fixed h-100 w-100 d-flex justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center gap-3'>
                <i className="pi pi-spin pi-spinner d-flex justify-content-center align-items-center"></i>
                {message || "" + ' Loading...'}
            </div>
        </div>
    )
}

export default Loading