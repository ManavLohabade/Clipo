import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Campaign {
  id: number;
  brand: string;
  title: string;
  rate: string;
  type: string;
  platforms: string[];
  budget: string;
  paidOut: string;
  percentage: number;
  views: string;
  verified: boolean;
  icon: string;
  description?: string;
  category?: string;
  paymentRate?: string;
  duration?: string;
  targetAudience?: string;
  requirements?: string;
  tags?: string;
  createdAt?: Date;
}

interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'paidOut' | 'percentage' | 'views' | 'verified' | 'createdAt'>) => void;
  updateCampaign: (id: number, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: number) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      brand: 'Stake',
      title: 'Stake Clips',
      rate: '$2.00 / 1K',
      type: 'Clipping',
      platforms: ['Instagram', 'TikTok', 'X'],
      budget: '$40,000.00',
      paidOut: '$11.87',
      percentage: 0,
      views: '5,432',
      verified: true,
      icon: '🎯'
    },
    {
      id: 2,
      brand: 'OddsJam',
      title: 'OddsJam Clipping Campaign',
      rate: '$2.00 / 1K',
      type: 'Clipping',
      platforms: ['Instagram', 'TikTok', 'X'],
      budget: '$40,000.00',
      paidOut: '$400.00',
      percentage: 1,
      views: '5,315',
      verified: true,
      icon: '📊'
    },
    {
      id: 3,
      brand: 'Timothy Sykes',
      title: 'Timothy Sykes Clips (Earn $2 per 1,000 Views)',
      rate: '$2.00 / 1K',
      type: 'Clipping',
      platforms: ['Instagram', 'TikTok', 'YouTube'],
      budget: '$29,926.28',
      paidOut: '$3,291.89',
      percentage: 11,
      views: '8,462,274',
      verified: true,
      icon: '💹'
    },
    {
      id: 4,
      brand: 'CEO Gage',
      title: 'CEO Gage Clips',
      rate: '$2.00 / 1K',
      type: 'Clipping',
      platforms: ['Instagram'],
      budget: '$40,000.00',
      paidOut: '$0.00',
      percentage: 0,
      views: '0',
      verified: true,
      icon: '👔'
    },
    {
      id: 5,
      brand: 'Lingo Face',
      title: 'Lingo Face UGCs',
      rate: '$2.00 / 1K',
      type: 'UGC',
      platforms: ['Instagram', 'X', 'YouTube'],
      budget: '$40,000.00',
      paidOut: '$0.00',
      percentage: 0,
      views: '0',
      verified: true,
      icon: '🎭'
    }
  ]);

  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'paidOut' | 'percentage' | 'views' | 'verified' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now(), // Generate unique ID
      paidOut: '$0.00',
      percentage: 0,
      views: '0',
      verified: false,
      createdAt: new Date(),
    };
    
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const updateCampaign = (id: number, updates: Partial<Campaign>) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id ? { ...campaign, ...updates } : campaign
      )
    );
  };

  const deleteCampaign = (id: number) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  };

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, deleteCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};
