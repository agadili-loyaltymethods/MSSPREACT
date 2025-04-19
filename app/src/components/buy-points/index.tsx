
import { useForm, Controller } from 'react-hook-form';

interface BuyPointsProps {
  onClose: (value: number | false) => void;
}

interface FormValues {
  points: number;
  size: string;
}

const pointsList = [
  { displayName: '5,000 Points: $60.00', value: 5000 },
  { displayName: '10,000 Points: $120.00', value: 10000 },
  { displayName: '15,000 Points: $180.00', value: 15000 },
  { displayName: '20,000 Points: $240.00', value: 20000 },
  { displayName: '25,000 Points: $275.00', value: 25000 },
  { displayName: '30,000 Points: $330.00', value: 30000 },
  { displayName: '35,000 Points: $385.00', value: 35000 },
  { displayName: '40,000 Points: $440.00', value: 40000 }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function BuyPoints({ onClose }: BuyPointsProps) {
  const { control, handleSubmit, formState: { isValid } } = useForm<FormValues>({
    defaultValues: {
      points: 0,
      size: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    onClose(data.points);
  };

  return (
    <div className="w-[500px] h-[250px]">
      <div className="flex items-center p-5 pb-0">
        <h3 className="m-0">Buy Points</h3>
        <div className="flex-1" />
        <button 
          onClick={() => onClose(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <span className="text-2xl">×</span>
        </button>
      </div>
      <hr />
      
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col px-5"
      >
        <div className="mt-5">
          <Controller
            name="points"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="Please select required points"
              >
                <option value="">Select Required Points</option>
                {pointsList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="mt-5">
          <Controller
            name="size"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2.5 border border-gray-300 rounded-md"
                placeholder="Please select a T-shirt Size"
              >
                <option value="">Select T-shirt Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="flex justify-end gap-5 mt-5">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
          >
            Buy
          </button>
        </div>
      </form>
    </div>
  );
}