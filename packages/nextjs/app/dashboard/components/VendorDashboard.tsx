import { useState } from "react";
import { AddItem } from "./vendor/AddItem";
import { onFormAction } from "./vendor/itemSubmit";




const VendorDashboard = () => {
    
    // State variables for managing product data
    const [products, setProducts] = useState([]);    
    const [orders, setOrders] = useState([]);    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    
    
    
  return (
    <>
      <div className="w-full justify-center flex">
        <AddItem
          onFormAction={onFormAction}
        />
      </div>    
    </>
  )
}

export default VendorDashboard;