import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Coins,
  Star,
  Crown,
  Palette,
  Dice1,
  User,
  Sparkles,
  Check,
  Lock,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUserProfileStore } from '../../store/userProfileStore';
import { COSMETIC_ITEMS } from '../../constants/rewards';
import { CosmeticType } from '../../types';

interface ShopPageProps {
  onClose: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onClose }) => {
  const { profile, purchaseCosmetic, equipCosmetic } = useUserProfileStore();
  const [activeCategory, setActiveCategory] = useState<CosmeticType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState<'ALL' | 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'>('ALL');
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);

  // Flatten all cosmetic items
  const allItems = [
    ...COSMETIC_ITEMS.TOKEN_SKINS,
    ...COSMETIC_ITEMS.BOARD_THEMES,
    ...COSMETIC_ITEMS.DICE_DESIGNS,
    ...COSMETIC_ITEMS.AVATARS
  ];

  const categories = [
    { id: 'ALL', label: 'All Items', icon: ShoppingBag },
    { id: CosmeticType.TOKEN_SKIN, label: 'Token Skins', icon: Crown },
    { id: CosmeticType.BOARD_THEME, label: 'Board Themes', icon: Palette },
    { id: CosmeticType.DICE_DESIGN, label: 'Dice Designs', icon: Dice1 },
    { id: CosmeticType.AVATAR, label: 'Avatars', icon: User }
  ];

  const rarityColors: Record<string, string> = {
    COMMON: 'text-gray-600 bg-gray-100',
    RARE: 'text-blue-600 bg-blue-100',
    EPIC: 'text-purple-600 bg-purple-100',
    LEGENDARY: 'text-orange-600 bg-orange-100'
  };

  const filteredItems = allItems.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.type === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'ALL' || item.rarity === filterRarity;
    return matchesCategory && matchesSearch && matchesRarity;
  });

  const handlePurchase = async (item: any) => {
    if (!profile || profile.coins < item.price) return;

    const success = purchaseCosmetic(item.id, item.price);
    if (success) {
      setPurchaseAnimation(item.id);
      setTimeout(() => setPurchaseAnimation(null), 1000);
    }
  };

  const handleEquip = (item: any) => {
    equipCosmetic(item.type, item.id);
  };

  const isOwned = (itemId: string) => profile?.ownedCosmetics.includes(itemId) || false;
  const isEquipped = (item: any) => {
    if (!profile) return false;
    const equippedItem = profile.equippedCosmetics[item.type as keyof typeof profile.equippedCosmetics];
    return equippedItem === item.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-8 h-8" />
              Cosmetic Shop
            </h1>
          </div>

          {/* Coin Balance */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold text-lg">
              {profile?.coins.toLocaleString() || '0'}
            </span>
          </div>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeCategory === category.id
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterRarity}
                    onChange={(e) => setFilterRarity(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="ALL">All Rarities</option>
                    <option value="COMMON">Common</option>
                    <option value="RARE">Rare</option>
                    <option value="EPIC">Epic</option>
                    <option value="LEGENDARY">Legendary</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredItems.map((item, index) => {
                  const owned = isOwned(item.id);
                  const equipped = isEquipped(item);
                  const canAfford = profile ? profile.coins >= item.price : false;
                  const isPurchasing = purchaseAnimation === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <Card className={`h-full transition-all hover:shadow-xl ${
                        equipped ? 'ring-2 ring-green-400 bg-green-50' : 'bg-white'
                      } ${isPurchasing ? 'animate-pulse' : ''}`}>
                        <CardContent className="p-4">
                          {/* Item Preview */}
                          <div className="relative mb-4">
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {/* Enhanced Preview based on item type */}
                              {item.type === CosmeticType.TOKEN_SKIN && (
                                <div className="flex gap-2">
                                  <div className={`w-8 h-8 rounded-full border-2 ${item.id === 'golden_tokens' ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-yellow-400 shadow-yellow-400/50 shadow-lg' : item.id === 'crystal_tokens' ? 'bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-400 border-cyan-300 shadow-cyan-400/60 shadow-xl' : item.id === 'neon_tokens' ? 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 border-pink-400 shadow-pink-500/70 shadow-lg' : 'bg-red-500 border-red-600'}`} />
                                  <div className={`w-8 h-8 rounded-full border-2 ${item.id === 'golden_tokens' ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-yellow-400 shadow-yellow-400/50 shadow-lg' : item.id === 'crystal_tokens' ? 'bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-400 border-cyan-300 shadow-cyan-400/60 shadow-xl' : item.id === 'neon_tokens' ? 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 border-pink-400 shadow-pink-500/70 shadow-lg' : 'bg-green-500 border-green-600'}`} />
                                  <div className={`w-8 h-8 rounded-full border-2 ${item.id === 'golden_tokens' ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-yellow-400 shadow-yellow-400/50 shadow-lg' : item.id === 'crystal_tokens' ? 'bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-400 border-cyan-300 shadow-cyan-400/60 shadow-xl' : item.id === 'neon_tokens' ? 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 border-pink-400 shadow-pink-500/70 shadow-lg' : 'bg-blue-500 border-blue-600'}`} />
                                </div>
                              )}
                              {item.type === CosmeticType.BOARD_THEME && (
                                <div className={`w-20 h-20 rounded-lg border-2 ${item.id === 'royal_palace' ? 'bg-gradient-to-br from-purple-300 to-pink-400 border-purple-800' : item.id === 'space_station' ? 'bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-400' : item.id === 'forest_grove' ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-800' : 'bg-gradient-to-br from-yellow-200 to-amber-300 border-amber-800'}`}>
                                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                      <div key={i} className={`rounded-sm ${item.id === 'royal_palace' ? 'bg-purple-100' : item.id === 'space_station' ? 'bg-slate-700' : item.id === 'forest_grove' ? 'bg-green-100' : 'bg-white'}`} />
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.type === CosmeticType.DICE_DESIGN && (
                                <div className={`w-16 h-16 rounded-lg border-2 grid grid-cols-3 grid-rows-3 gap-1 p-2 ${item.id === 'wooden_dice' ? 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-900' : item.id === 'diamond_dice' ? 'bg-gradient-to-br from-cyan-100 to-blue-200 border-cyan-400' : item.id === 'fire_dice' ? 'bg-gradient-to-br from-red-500 to-orange-600 border-red-700' : 'bg-white border-gray-800'}`}>
                                  {[0, 2, 4, 6, 8].map(i => (
                                    <div key={i} className={`${i === 4 ? 'col-start-2 row-start-2' : ''}`}>
                                      {i === 4 && <div className={`w-2 h-2 rounded-full ${item.id === 'wooden_dice' ? 'bg-amber-100' : item.id === 'diamond_dice' ? 'bg-cyan-800' : item.id === 'fire_dice' ? 'bg-yellow-100' : 'bg-black'}`} />}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {item.type === CosmeticType.AVATAR && (
                                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl ${item.id.includes('male') ? (item.id === 'male_knight' ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-800' : item.id === 'male_wizard' ? 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-800' : 'bg-gradient-to-br from-red-500 to-red-700 border-red-800') : (item.id === 'female_knight' ? 'bg-gradient-to-br from-pink-500 to-pink-700 border-pink-800' : item.id === 'female_mage' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 border-indigo-800' : 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900')}`}>
                                  {item.id.includes('knight') ? '🛡️' : item.id.includes('wizard') || item.id.includes('mage') ? '🧙' : item.id.includes('warrior') ? '⚔️' : item.id.includes('assassin') ? '🗡️' : '👤'}
                                </div>
                              )}
                            </div>

                            {/* Rarity Badge */}
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${rarityColors[item.rarity]}`}>
                              {item.rarity}
                            </div>

                            {/* Equipped Badge */}
                            {equipped && (
                              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Equipped
                              </div>
                            )}

                            {/* Owned Badge */}
                            {owned && !equipped && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                Owned
                              </div>
                            )}
                          </div>

                          {/* Item Info */}
                          <div className="mb-4">
                            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Coins className="w-4 h-4 text-yellow-500" />
                                <span className="font-bold text-lg">{item.price.toLocaleString()}</span>
                              </div>

                              {item.rarity === 'LEGENDARY' && (
                                <Sparkles className="w-5 h-5 text-orange-500" />
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            {owned ? (
                              equipped ? (
                                <Button disabled className="w-full bg-green-500 text-white">
                                  <Check className="w-4 h-4 mr-2" />
                                  Equipped
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleEquip(item)}
                                  className="w-full"
                                  variant="game"
                                >
                                  Equip
                                </Button>
                              )
                            ) : (
                              <Button
                                onClick={() => handlePurchase(item)}
                                disabled={!canAfford || isPurchasing}
                                className={`w-full ${
                                  canAfford
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {isPurchasing ? (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                    Purchasing...
                                  </>
                                ) : canAfford ? (
                                  <>
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Purchase
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Insufficient Coins
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">No Items Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Featured Items Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Featured Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl mb-2">💎</div>
                  <h4 className="font-bold">Crystal Tokens</h4>
                  <p className="text-sm opacity-80">Legendary rarity</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl mb-2">🏰</div>
                  <h4 className="font-bold">Royal Palace Board</h4>
                  <p className="text-sm opacity-80">Epic rarity</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl mb-2">🔥</div>
                  <h4 className="font-bold">Fire Dice</h4>
                  <p className="text-sm opacity-80">Epic rarity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopPage;
