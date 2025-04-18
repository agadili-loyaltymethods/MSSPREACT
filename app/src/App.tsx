import React, { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import { Url } from "./enums/url";
import Casino from "./pages/Casino";
import HotelBooking from "./pages/HotelBooking";
import ApiClient from "./services/api/apiClient";
import { ensureAuthenticated } from "./services/auth/loginService";
import { setLocation } from "./store/reducers/location-reducer";
import { useAppContext } from "./components/AppContext";
import { getAppConfig } from "./services/configService";

interface LoyaltyContextType {
  loyaltyId: string;
  setLoyaltyId: React.Dispatch<React.SetStateAction<string>>;
}

export const LoyaltyContext = createContext<LoyaltyContextType>({
  loyaltyId: "1001",
  setLoyaltyId: () => { },
});

// Component for updating the document title based on the current location
// and handling URL query parameters
const UpdateTitleAndParams: React.FC<{ setLoyaltyId: React.Dispatch<React.SetStateAction<string>> }> = ({ setLoyaltyId }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appConfig } = useAppContext();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/hotel-booking": "MSSP | Hotel Management System",
      "/casino": "MSSP | Casino Management System",
    };
    document.title = titles[location.pathname] || "MSSP | Demo";

    // Extract loyaltyId from URL if it exists
    const urlLoyaltyId = searchParams.get('loyaltyId');
    const urlLocationNumber = searchParams.get('location');
    if (urlLoyaltyId) {
      setLoyaltyId(urlLoyaltyId);
      localStorage.setItem("lid", urlLoyaltyId);

      // Clear the query parameter by navigating to the same path without query params
      navigate(location.pathname, { replace: true });
    }


    if (urlLocationNumber) {
      const fetchAndSetLocation = async () => {
        try {
          const response: any = await ApiClient.get(`${appConfig.config.REST_URL}/${Url.locations}`);
          const msspLocations = response.filter((location: any) => !location.ext.hideInMSSP);

          // Find the location that matches the URL parameter
          const selectedLocation = msspLocations.find(
            (loc: any) => loc.number === urlLocationNumber
          );

          if (selectedLocation) {
            dispatch(
              setLocation({
                name: selectedLocation.name,
                number: selectedLocation.number,
                type: selectedLocation?.ext?.type || '',
                operator: selectedLocation?.ext?.operator || ''
              })
            );
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };

      fetchAndSetLocation();
    }

    // Clear the query parameters by navigating to the same path without query params
    if (urlLoyaltyId || urlLocationNumber) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, searchParams, setLoyaltyId, navigate, dispatch]);

  return null;
};

const AppContent: React.FC = () => {
  const storedLid = localStorage.getItem("lid") ?? "1001";
  const [loyaltyId, setLoyaltyId] = useState<string>(storedLid);

  return (
    <LoyaltyContext.Provider value={{ loyaltyId, setLoyaltyId }}>
      <UpdateTitleAndParams setLoyaltyId={setLoyaltyId} />
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/hotel-booking" replace />} />
          <Route path="/hotel-booking" element={<HotelBooking />} />
          <Route path="/casino" element={<Casino />} />
        </Routes>
      </div>
    </LoyaltyContext.Provider>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("lid")) {
      localStorage.setItem("lid", "1001");
    }
    ensureAuthenticated(getAppConfig().config.REST_URL)
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;