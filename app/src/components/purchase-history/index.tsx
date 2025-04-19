
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useAppSelector';
import { useMemberService } from '@/lib/hooks/useMemberService';
import { useToast } from '@/lib/hooks/useToast';
import { formatters } from '@/lib/utils/formatters';
import { NoData } from '../common/no-data';

const LOB = {
  FOOD: 'Food & Beverage',
  HOTEL: 'Hotel',
  RETAIL: 'Retail',
  GAMING: 'Gaming'
};

export function PurchaseHistory() {
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const memberInfo = useAppSelector(state => state.member);
  const { getActivityHistory } = useMemberService();
  const { showError } = useToast();

  useEffect(() => {
    if (memberInfo?._id) {
      getHistory();
    }
  }, [memberInfo]);

  const getHistory = async () => {
    try {
      const history = await getActivityHistory(memberInfo._id);
      const processedHistory = history
        .filter((item: any) => item.status === 'Processed')
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(formatHistory);

      setPurchaseHistory(processedHistory);
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatHistory = (history: any) => {
    const pointsValue = getTotalPurse(history.result?.data?.purses);
    return {
      date: history.date,
      bookingId: history?.ext?.folioId || '-',
      location: history?.location?.name || '-',
      desc: history.result?.data?.desc || '-',
      total: getPurseValue(history.result?.data?.purses, 'Status Points'),
      serviceStatusPoints: getPurseValue(history.result?.data?.purses, 'GCGC Status Points'),
      rewardUsed: pointsValue < 0 ? Math.abs(pointsValue) : 0,
      spend: history.value,
      basePoints: pointsValue,
      lob: history?.ext?.lob,
      type: history.type,
      value: history.value,
      id: history._id,
      isExpandable: history.type === 'Accrual',
      expanded: false,
      gaming: history?.ext?.gaming,
      lineItems: history.lineItems.map((item: any) => ({ 
        ...item, 
        lob: history?.ext?.lob 
      })),
      nestedData: [],
      summary: {}
    };
  };

  const getPurseValue = (purses: any[], type: string) => {
    const selectedPurse = purses?.find((purse: any) => purse.name === type);
    if (selectedPurse) {
      return selectedPurse.new - selectedPurse.prev;
    }
    return 0;
  };

  const getTotalPurse = (purses: any[], isStatus = false) => {
    const selectedPurses = purses?.filter((purse: any) => 
      isStatus ? purse.name.includes('Status') : !purse.name.includes('Status')
    );
    if (selectedPurses?.length) {
      return selectedPurses.reduce((acc, purse) => 
        (purse.new - purse.prev) + acc, 0
      );
    }
    return 0;
  };

  const getNestedData = (lineItems: any[]) => {
    const nestedData: any[] = [];
    Object.keys(LOB).forEach(key => {
      const filteredItems = lineItems.filter(
        lineItem => lineItem?.lob?.toUpperCase() === key
      );
      if (filteredItems.length) {
        nestedData.push({
          title: LOB[key as keyof typeof LOB],
          subTotal: { 
            key: 'Subtotal', 
            value: getTotal(filteredItems, 'Normal') 
          },
          offers: getOffers(filteredItems, 'Discount'),
          tax: { 
            key: 'Tax', 
            value: getTotal(filteredItems, 'Tax') 
          },
          gratuity: { 
            key: 'Gratuity', 
            value: getTotal(filteredItems, 'Gratuity') 
          },
          total: { 
            key: `Total ${LOB[key as keyof typeof LOB]}`, 
            value: getTotal(filteredItems) 
          }
        });
      }
    });
    return nestedData;
  };

  const getOffers = (lineItems: any[], type: string) => {
    const discountItems = lineItems.filter(item => item.type === type);
    const uniqueItems = new Set(discountItems.map(item => item.itemSKU));
    return Array.from(uniqueItems).map(sku => ({
      key: sku,
      value: discountItems
        .filter(item => item.itemSKU === sku)
        .reduce((acc, val) => acc + val.itemAmount, 0)
    }));
  };

  const getTotal = (lineItems: any[], type = '') => {
    return lineItems
      .filter(item => !type || item.type === type)
      .reduce((acc, val) => acc + val.itemAmount, 0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredHistory = purchaseHistory.filter(item => 
    item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {/* Add skeleton loading UI */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-[1300px] mt-5">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-lg font-medium">Activity History</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded"
              />
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Activity</th>
                    <th className="p-4 text-left">Folio #</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Details</th>
                    <th className="p-4 text-right">Total Spend</th>
                    <th className="p-4 text-right">Status Points</th>
                    <th className="p-4 text-right">SP Status Points</th>
                    <th className="p-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">{item.type}</td>
                      <td className="p-4">{item.bookingId}</td>
                      <td className="p-4">{item.location}</td>
                      <td className="p-4">
                        {item.gaming ? 'Gaming' : item.desc}
                      </td>
                      <td className="p-4 text-right">
                        {item.spend ? formatters.formatCurrency(item.spend) : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`
                          px-2 py-1 rounded
                          ${item.total > 0 ? 'bg-green-100 text-green-800' :
                            item.total < 0 ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {item.total ? formatters.formatNumber(item.total) : '-'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`
                          px-2 py-1 rounded
                          ${item.serviceStatusPoints > 0 ? 'bg-green-100 text-green-800' :
                            item.serviceStatusPoints < 0 ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {item.serviceStatusPoints ? 
                            formatters.formatNumber(item.serviceStatusPoints) : 
                            '-'
                          }
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`
                          px-2 py-1 rounded
                          ${item.basePoints > 0 ? 'bg-green-100 text-green-800' :
                            item.basePoints < 0 ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {item.basePoints ? 
                            formatters.formatNumber(item.basePoints) : 
                            '-'
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData>No data found.</NoData>
          )}
        </div>
      </div>
    </div>
  );
}
