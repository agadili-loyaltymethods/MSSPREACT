```tsx
interface RedeemDialogProps {
  coupon: {
    desc: string;
    code: string;
  };
  onClose: (value: boolean) => void;
}

export function RedeemDialog({ coupon, onClose }: RedeemDialogProps) {
  return (
    <div className="w-[600px] h-[250px]">
      <div className="flex items-center px-5 pt-2.5 pb-0">
        <h3 className="m-0">Redeem Coupon</h3>
        <div className="flex-1" />
        <button 
          onClick={() => onClose(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
      
      <hr />
      
      <div className="flex flex-col px-5">
        <div className="flex items-center mt-5">
          <p>
            Are you sure you want to redeem your{' '}
            <span className="text-primary ml-1.5">{coupon.desc}?</span>
          </p>
        </div>
        
        <div className="flex flex-col mt-5">
          <p className="text-primary text-left w-full">Coupon Code</p>
          <span className="text-primary bg-primary-bg p-2.5 font-mono">
            {coupon.code}
          </span>
        </div>
        
        <div className="flex justify-end mt-auto">
          <button
            onClick={() => onClose(false)}
            className="mr-5 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onClose(true)}
            className="px-4 py-2 h-12.5 w-25 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}
```