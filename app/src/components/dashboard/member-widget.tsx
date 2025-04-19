```tsx
import { Member } from '@/types/member';

interface MemberWidgetProps {
  memberInfo: Member;
}

export function MemberWidget({ memberInfo }: MemberWidgetProps) {
  return (
    <div className="flex-[0_0_25%] bg-white rounded-xl shadow-md p-5">
      <div className="welcome-section h-full flex flex-col">
        <div className="user-header mb-4">
          <div className="user-welcome">
            <h2 className="text-gray-500 text-sm font-medium m-0">Welcome back,</h2>
            <h1 className="text-gray-800 text-2xl font-bold m-0 leading-tight">
              {memberInfo?.firstName} {memberInfo?.lastName}
            </h1>
          </div>
        </div>

        <div className="user-details flex-1 flex flex-col justify-between">
          <div className="detail-item flex items-center bg-gray-50 rounded-lg p-2.5 mb-2">
            <span className="material-icons text-primary mr-2.5">badge</span>
            <span>
              <small className="text-gray-500 text-xs">Loyalty ID</small>
              <div className="text-gray-800 font-semibold text-sm">
                {memberInfo?.loyaltyId}
              </div>
            </span>
          </div>

          <div className="detail-item flex items-center bg-gray-50 rounded-lg p-2.5 mb-2">
            <span className="material-icons text-primary mr-2.5">email</span>
            <span>
              <small className="text-gray-500 text-xs">Email</small>
              <div className="text-gray-800 font-semibold text-sm">
                {memberInfo?.email || '-'}
              </div>
            </span>
          </div>

          <div className="detail-item flex items-center bg-gray-50 rounded-lg p-2.5">
            <span className="material-icons text-primary mr-2.5">calendar_today</span>
            <span>
              <small className="text-gray-500 text-xs">Member Since</small>
              <div className="text-gray-800 font-semibold text-sm">
                {new Date(memberInfo?.enrollDate).toLocaleDateString()}
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```