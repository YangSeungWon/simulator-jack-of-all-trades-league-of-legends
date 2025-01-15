import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import axios from 'axios';
import './App.css';
import ReactDOM from 'react-dom';

interface StatTranslation {
  [key: string]: string;
}

interface CategoryTranslation {
  [key: string]: string;
}

// interface DetailedStatTranslation {
//   [key: string]: string;
// }

interface Item {
  id: string;
  name: string;
  colloq?: string;
  gold: {
    total: number;
    purchasable: boolean;
  };
  description: string;
  plaintext: string;
  tags: string[];
  from?: string[];
  into?: string[];
  maps: {
    [key: string]: boolean;
  };
}

interface OverlayProps {
  children: React.ReactNode;
  position: {
    x: number;
    y: number;
  };
}

const statTranslation: StatTranslation = {
  'Health': '체력',
  'Base Health Regen': '기본 체력 재생',
  'Armor': '방어력',
  'Magic Resist': '마법 저항력',
  'Tenacity': '강인함',
  'Attack Damage': '공격력',
  'Attack Speed': '공격 속도',
  'Critical Strike Chance': '치명타 확률',
  'Lethality': '물리 관통력',
  'Armor Penetration': '방어구 관통력',
  'Life Steal': '생명력 흡수',
  'Ability Haste': '스킬 가속',
  'Mana': '마나',
  'Base Mana Regen': '기본 마나 재생',
  'Ability Power': '주문력',
  'Magic Penetration': '마법 관통력(고정 수치)',
  'Percent Magic Penetration': '마법 관통력(%)',
  'Movement Speed': '이동 속도(고정 수치)',
  'Percent Movement Speed': '이동 속도(%)',
  'Health and Shield Power': '체력 회복 및 보호막'
};

const jackOfAllTradesStats = Object.keys(statTranslation);

const categoryTranslation: CategoryTranslation = {
  "Lane": "라인전",
  "Health": "체력",
  "Damage": "데미지",
  "AttackSpeed": "공격 속도",
  "ArmorPenetration": "방어구 관통력",
  "Lifesteal": "생명력 흡수",
  "SpellDamage": "주문 피해",
  "SpellVamp": "주문 흡혈",
  "CooldownReduction": "재사용 대기시간 감소",
  "AbilityHaste": "스킬 가속",
  "SpellBlock": "주문 방어",
  "Armor": "방어력",
  "Slow": "둔화",
  "HealthRegen": "체력 재생",
  "Mana": "마나",
  "ManaRegen": "마나 재생",
  "Vision": "시야",
  "Boots": "신발",
  "NonbootsMovement": "이동 속도",
  "Active": "액티브",
  "OnHit": "적중 시 효과",
  "GoldPer": "골드 획득"
};

// const detailedStatTranslation: DetailedStatTranslation = {
//   'FlatHPPoolMod': '체력',
//   'rFlatHPModPerLevel': '레벨당 체력',
//   'FlatMPPoolMod': '마나',
//   'rFlatMPModPerLevel': '레벨당 마나',
//   'PercentHPPoolMod': '체력(%)',
//   'PercentMPPoolMod': '마나(%)',
//   'FlatHPRegenMod': '체력 재생',
//   'rFlatHPRegenModPerLevel': '레벨당 체력 재생',
//   'PercentHPRegenMod': '체력 재생(%)',
//   'FlatMPRegenMod': '마나 재생',
//   'rFlatMPRegenModPerLevel': '레벨당 마나 재생',
//   'PercentMPRegenMod': '마나 재생(%)',
//   'FlatArmorMod': '방어력',
//   'rFlatArmorModPerLevel': '레벨당 방어력',
//   'PercentArmorMod': '방어력(%)',
//   'rFlatArmorPenetrationMod': '방어구 관통력',
//   'rFlatArmorPenetrationModPerLevel': '레벨당 방어구 관통력',
//   'rPercentArmorPenetrationMod': '방어구 관통력(%)',
//   'rPercentArmorPenetrationModPerLevel': '레벨당 방어구 관통력(%)',
//   'FlatPhysicalDamageMod': '공격력',
//   'rFlatPhysicalDamageModPerLevel': '레벨당 공격력',
//   'PercentPhysicalDamageMod': '공격력(%)',
//   'FlatMagicDamageMod': '주문력',
//   'rFlatMagicDamageModPerLevel': '레벨당 주문력',
//   'PercentMagicDamageMod': '주문력(%)',
//   'FlatMovementSpeedMod': '이동 속도',
//   'rFlatMovementSpeedModPerLevel': '레벨당 이동 속도',
//   'PercentMovementSpeedMod': '이동 속도(%)',
//   'rPercentMovementSpeedModPerLevel': '레벨당 동 속도(%)',
//   'FlatAttackSpeedMod': '공격 속도',
//   'PercentAttackSpeedMod': '공격 도(%)',
//   'rPercentAttackSpeedModPerLevel': '레벨당 공격 속도(%)',
//   'rFlatDodgeMod': '회피',
//   'rFlatDodgeModPerLevel': '레벨당 회피',
//   'PercentDodgeMod': '회피(%)',
//   'FlatCritChanceMod': '치명타 확률',
//   'rFlatCritChanceModPerLevel': '레벨당 치명타 확률',
//   'PercentCritChanceMod': '치명타 확률(%)',
//   'FlatCritDamageMod': '명타 피해',
//   'rFlatCritDamageModPerLevel': '레벨당 치명타 피해',
//   'PercentCritDamageMod': '명타 피해(%)',
//   'FlatBlockMod': '방어',
//   'PercentBlockMod': '방어(%)',
//   'FlatSpellBlockMod': '마법 저항력',
//   'rFlatSpellBlockModPerLevel': '레벨당 마법 저항력',
//   'PercentSpellBlockMod': '마법 저항력(%)',
//   'FlatEXPBonus': '경험치 보너스',
//   'PercentEXPBonus': '경험치 보너스(%)',
//   'rPercentCooldownMod': '재사용 대기시간 감소(%)',
//   'rPercentCooldownModPerLevel': '레벨당 재사용 대기시간 감소(%)',
//   'rFlatTimeDeadMod': '사망 시간 감소',
//   'rFlatTimeDeadModPerLevel': '레벨당 사망 시간 소',
//   'rPercentTimeDeadMod': '사망 시간 감소(%)',
//   'rPercentTimeDeadModPerLevel': '레벨당 사망 시간 감소(%)',
//   'rFlatGoldPer10Mod': '10초당 골드',
//   'rFlatMagicPenetrationMod': '마법 관통력',
//   'rFlatMagicPenetrationModPerLevel': '레벨당 마법 관통력',
//   'rPercentMagicPenetrationMod': '마법 관통(%)',
//   'rPercentMagicPenetrationModPerLevel': '레벨당 마법 관통력(%)',
//   'FlatEnergyRegenMod': '에너지 재생',
//   'rFlatEnergyRegenModPerLevel': '레벨당 에너지 재생',
//   'FlatEnergyPoolMod': '에너지',
//   'rFlatEnergyModPerLevel': '레벨당 에너지',
//   'PercentLifeStealMod': '생명력 흡수(%)',
//   'PercentSpellVampMod': '주문 흡혈(%)'
// };

const Overlay: React.FC<OverlayProps> = ({ children, position }) => {
  return ReactDOM.createPortal(
    <div
      className="item-details-overlay"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {children}
    </div>,
    document.body
  );
};

// Define the stripHtmlTags function before it is used
const stripHtmlTags = (html: string): string => {
  // Remove Ornn icon from item names
  const withoutOrnnIcon = html.replace(/%i:ornnIcon%/g, '');

  // Replace <br> tags with a placeholder
  let withPlaceholder = withoutOrnnIcon.replace(/<br\s*\/?>/gi, '###BR###');

  // Replace <active> and <passive> tags with bold
  withPlaceholder = withPlaceholder.replace(/<(active|passive|attention)>/gi, '###bold###');
  withPlaceholder = withPlaceholder.replace(/<\/(active|passive|attention)>/gi, '###/bold###');

  // Create a temporary div element
  const div = document.createElement('div');
  div.innerHTML = withPlaceholder;

  // Get the text content
  let stripped = div.textContent || div.innerText || '';

  // Replace the placeholder back with <br> tags
  stripped = stripped.replace(/###BR###/g, '<br>');
  stripped = stripped.replace(/###bold###/g, '<b>');
  stripped = stripped.replace(/###\/bold###/g, '</b>');

  return stripped;
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

const fetchVersionWithCache = async () => {
  const cachedData = localStorage.getItem('versions');
  const cachedTimestamp = localStorage.getItem('versionsTimestamp');

  if (cachedData && cachedTimestamp) {
    const isExpired = Date.now() - Number(cachedTimestamp) > CACHE_DURATION;
    if (!isExpired) {
      return JSON.parse(cachedData);
    }
  }

  const response = await axios.get<string[]>('https://ddragon.leagueoflegends.com/api/versions.json');
  localStorage.setItem('versions', JSON.stringify(response.data));
  localStorage.setItem('versionsTimestamp', Date.now().toString());
  return response.data;
};

const App: React.FC = () => {
  const [items, setItems] = useState<[string, Item][]>([]);
  const [version, setVersion] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<(string | null)[]>(Array(6).fill(null));
  const [debug, setDebug] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string }>({ type: '', value: '' });
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const itemListRef = useRef<HTMLDivElement>(null);
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const removeItemById = (id: string) => {
    setItems((prevItems) => prevItems.filter(([itemId]) => itemId !== id));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebug(params.get('debug') === 'true');

    const fetchVersion = async () => {
      try {
        setError(null);
        const versions = await fetchVersionWithCache();
        setAvailableVersions(versions);
        setVersion(versions[0]);

        const itemsResponse = await axios.get<{ data: { [key: string]: Item } }>(`https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/ko_KR/item.json`);
        const allItems: [string, Item][] = Object.entries(itemsResponse.data.data);
        const filteredItems = allItems.filter(([id, item]) => item.maps && item.maps[11] && item.gold.purchasable && item.gold.total > 0);
        setItems(filteredItems);

        // 정글 진화 아이템 제거
        removeItemById('1105');
        removeItemById('1106');
        removeItemById('1107');
      } catch (error) {
        setError('버전 정보를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
        console.error('Error fetching version:', error);
      }
    };

    fetchVersion();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHoveredItem(null);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleItemClick = (id: string) => {
    setSelectedItems((prevSelectedItems) => {
      const index = prevSelectedItems.findIndex(item => item === null);
      if (index !== -1) {
        const newSelectedItems = [...prevSelectedItems];
        newSelectedItems[index] = id;
        return newSelectedItems;
      }
      return prevSelectedItems;
    });
  };

  const handleSelectedItemRemove = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      // Filter out the null values and the item to be removed
      const newSelectedItems = prevSelectedItems.filter((_, i) => i !== index && prevSelectedItems[i] !== null);
      // Fill the remaining slots with null
      while (newSelectedItems.length < 6) {
        newSelectedItems.push(null);
      }
      return newSelectedItems;
    });

    // Close the overlay when an item is removed
    setHoveredItem(null);
  };

  const parseDescriptionForStats = (description: string, itemId: string): { [key: string]: { value: number } } => {
    // Special case for item ID 3865 with an empty description
    if (itemId === '3865' && description.trim() === '') {
      return {
        '체력': { value: 30 },
        '기본 체력 재생(%)': { value: 25 },
        '기본 마나 재생(%)': { value: 25 },
        '10초당 골드': { value: 3 }
      };
    }

    const cleanDescription = description.replace(/<\/?b>/g, '');
    const stats: { [key: string]: { value: number } } = {};
    const regex = /^(체력|기본 체력 재생|방어력|마법 저항력|강인함|공격력|공격 속도|치명타 확률|물리 관통력|방어구 관통력|생명력 흡수|스킬 가속|마나|기본 마나 재생|주문력|마법 관통력|이동 속도|체력 회복 및 보호막)\s+(\d+)(%?)/;
    const lines = cleanDescription.split('<br>');
    for (const line of lines) {
      const match = line.match(regex);
      if (match) {
        const stat = match[1];
        const value = parseInt(match[2], 10);
        const isPercentage = match[3] === '%';
        let statType: string;
        if (stat === '마법 관통력' || stat === '이동 속도') {
          if (isPercentage) {
            statType = `${stat}(%)`;
          } else {
            statType = `${stat}(고정 수치)`;
          }
        } else {
          statType = categoryTranslation[stat] || stat;
        }

        if (!stats[statType]) {
          stats[statType] = { value: 0 };
        }
        stats[statType].value += value;
      }
    }
    return stats;
  };

  const calculateTotalStats = (): { [key: string]: number } => {
    const totalStats: { [key: string]: number } = {};

    selectedItems.forEach(id => {
      if (id) {
        const item = items.find(([itemId]) => itemId === id);
        if (item) {
          const itemStats = parseDescriptionForStats(stripHtmlTags(item[1].description), id);
          Object.entries(itemStats).forEach(([stat, { value }]) => {
            if (totalStats[stat]) {
              totalStats[stat] += value;
            } else {
              totalStats[stat] = value;
            }
          });
        }
      }
    });

    return totalStats;
  };

  const calculateJackOfAllTrades = () => {
    const totalStats = calculateTotalStats();
    const activeStats = jackOfAllTradesStats.filter(stat => totalStats[statTranslation[stat]]);
    const inactiveStats = jackOfAllTradesStats.filter(stat => !totalStats[statTranslation[stat]]);

    const stackCount = activeStats.length;
    const abilityHaste = stackCount;
    const adaptiveBonus = stackCount >= 10 ? 25 : stackCount >= 5 ? 10 : 0;

    return { activeStats, inactiveStats, stackCount, abilityHaste, adaptiveBonus };
  };

  const { activeStats, inactiveStats, stackCount, abilityHaste, adaptiveBonus } = calculateJackOfAllTrades();
  const totalStats = calculateTotalStats(); // Define totalStats here

  const handleCategoryButtonClick = (tag: string) => {
    setActiveFilter((prevFilter) =>
      prevFilter.type === 'category' && prevFilter.value === tag ? { type: '', value: '' } : { type: 'category', value: tag }
    );
  };

  const handleJackOfAllTradesFilterClick = (stat: string) => {
    setActiveFilter((prevFilter) =>
      prevFilter.type === 'jack' && prevFilter.value === stat ? { type: '', value: '' } : { type: 'jack', value: stat }
    );
  };

  const filterItems = (items: [string, Item][]) => {
    if (!activeFilter.value) return items.sort((a, b) => a[1].gold.total - b[1].gold.total);

    let filteredItems;
    if (activeFilter.type === 'category') {
      filteredItems = items.filter(([id, item]) => item.tags.includes(activeFilter.value));
    } else if (activeFilter.type === 'jack') {
      filteredItems = items.filter(([id, item]) => {
        const itemStats = parseDescriptionForStats(stripHtmlTags(item.description), id);
        return itemStats[statTranslation[activeFilter.value]];
      });
    } else {
      filteredItems = items;
    }

    return filteredItems.sort((a, b) => a[1].gold.total - b[1].gold.total);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filterItemsBySearch = (items: [string, Item][], query: string) => {
    if (!query) return items;
    const lowerCaseQuery = query.toLowerCase();
    return items.filter(([id, item]) => {
      const nameMatches = item.name.toLowerCase().includes(lowerCaseQuery);
      const colloqMatches = item.colloq && item.colloq.toLowerCase().split(';').some(col => col.includes(lowerCaseQuery));
      return nameMatches || colloqMatches;
    });
  };

  const handleResetItems = () => {
    setSelectedItems(Array(6).fill(null));
  };

  const handleItemMouseEnter = (id: string, event: MouseEvent<HTMLDivElement>) => {
    setHoveredItem(id);

    const itemElement = event.currentTarget;
    const rect = itemElement.getBoundingClientRect();

    const overlayWidth = 550;
    const overlayHeight = 600;

    let x = rect.right - 5;
    let y = rect.bottom - 5;

    if (x + overlayWidth > window.innerWidth) {
      x = rect.left - overlayWidth - 10;
    }

    if (y + overlayHeight > window.innerHeight) {
      y = window.innerHeight - overlayHeight - 10;
    }

    setOverlayPosition({ x, y });
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
  };

  const renderOverlayContent = (id: string) => {
    const item = items.find(([itemId]) => itemId === id)?.[1];
    if (!item) return null;
    const description = id === '3865' && item.description.trim() === ''
      ? `
        체력 <b>30</b><br>
        기본 체력 재생 <b>25%</b><br>
        기본 마나 재생 <b>25%</b><br>
        10초당 골드 <b>3</b>
      `
      : stripHtmlTags(item.description);
    return (
      <>
        <h2>
          {item.name}<br />
          {item.colloq && <span className="colloq-name"> ({item.colloq})</span>}
        </h2>
        {debug && <p>ID: {id}</p>}
        <p><b>가격:</b> {item.gold.total} 골드</p>
        <p><i>{item.plaintext}</i></p>
        <p><strong>효과</strong><br />
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </p>
        <div>
          <strong>상위 아이템:</strong>
          <div className="into-images">
            {item.into ? item.into
              .filter(intoId => {
                const intoItem = items.find(([itemId]) => itemId === intoId);
                return intoItem && intoItem[1].maps && intoItem[1].maps[11];
              })
              .map((intoId) => (
                <img
                  key={intoId}
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${intoId}.png`}
                  alt={`Item ${intoId}`}
                  className="into-item"
                />
              )) : <p>없음</p>}
          </div>
        </div>
        <div>
          <strong>하위 아이템:</strong>
          <div className="from-images">
            {item.from ? item.from
              .filter(fromId => {
                const fromItem = items.find(([itemId]) => itemId === fromId);
                return fromItem && fromItem[1].maps && fromItem[1].maps[11];
              })
              .map((fromId) => (
                <img
                  key={fromId}
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${fromId}.png`}
                  alt={`Item ${fromId}`}
                  className="from-item"
                />
              )) : <p>없음</p>}
          </div>
        </div>
      </>
    );
  };

  const calculateTotalGold = (): number => {
    return selectedItems.reduce((total, id) => {
      if (id) {
        const item = items.find(([itemId]) => itemId === id);
        if (item) {
          return total + item[1].gold.total;
        }
      }
      return total;
    }, 0);
  };

  const handleVersionChange = async (selectedVersion: string) => {
    try {
      setError(null);
      setVersion(selectedVersion);

      const itemsResponse = await axios.get<{ data: { [key: string]: Item } }>(
        `https://ddragon.leagueoflegends.com/cdn/${selectedVersion}/data/ko_KR/item.json`
      );

      const allItems: [string, Item][] = Object.entries(itemsResponse.data.data);
      const filteredItems = allItems.filter(([id, item]) =>
        item.maps && item.maps[11] && item.gold.purchasable && item.gold.total > 0
      );

      setItems(filteredItems);

      // 정글 진화 아이템 제거
      removeItemById('1105');
      removeItemById('1106');
      removeItemById('1107');
    } catch (error) {
      setError('아이템 데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <img src="logo512.png" alt="App Icon" className="app-icon" />
        <h1>League of Legends - Item Builder (다재다능 시뮬레이터)</h1>
        <div className="version-selector">
          <select
            value={version}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="version-select"
          >
            {availableVersions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="content">
        <div className="left-panel">
          <div className="selected-items-container">
            <div className="selected-items slot-container">
              {selectedItems
                .map((id, index) => {
                  if (id === null) {
                    return (
                      <div key={index} className="empty-slot">
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="selected-item"
                      onClick={() => handleSelectedItemRemove(index)}
                      onMouseEnter={(e) => handleItemMouseEnter(id, e)} // Add this line
                      onMouseLeave={handleItemMouseLeave} // Add this line
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                        alt={`Item ${id}`}
                      />
                      {hoveredItem === id && (
                        <Overlay position={overlayPosition}>
                          {renderOverlayContent(id)}
                        </Overlay>
                      )}
                    </div>
                  );
                })
                .sort((a, b) => {
                  if (a.props.className === 'empty-slot') return 1;
                  if (b.props.className === 'empty-slot') return -1;

                  const itemA = items.find(([itemId]) => itemId === a.key);
                  const itemB = items.find(([itemId]) => itemId === b.key);

                  if (!itemA || !itemB) return 0;

                  return itemB[1].gold.total - itemA[1].gold.total;
                })}
              <button onClick={handleResetItems} className="reset-button">초기화</button>
              <div className="total-gold">
                총 골드: <strong>{calculateTotalGold()}</strong>
              </div>
            </div>
          </div>
          <div className="total-stats">
            <h3>능력치 총합:</h3>
            {selectedItems.every(item => item === null) && (
              <p className="empty-slots-message">
                아이템 창이 비어 있습니다. 오른쪽에서 아이템을 선택하여 추가하세요.
              </p>
            )}
            <ul className="total-stats-list">
              {Object.entries(totalStats).map(([stat, value]) => (
                <li key={stat} className="total-stat-item">
                  <span className="stat-icon">📊</span> {stat}: &nbsp;<strong>{value}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="jack-of-all-trades">
            <h3>다재다능:</h3>
            <p>
              현재 중첩: <strong>{stackCount}</strong> (스킬 가속: <strong>{abilityHaste}</strong>, 추가 적응형 능력치: <strong>{adaptiveBonus}</strong>)
            </p>
            <div className="jack-container">
              <img src="jack.webp" alt="Jack of All Trades" className="jack-image" />
              <div className="jack-description">
                <p style={{ fontSize: '0.75em' }}>
                  다재다능에서 얻는 능력치: 아이템으로 얻은 서로 다른 능력치 하나당 잭 중첩을 얻습니다.
                  중첩 하나당 스킬 가속이 1 증가합니다. 5회 및 10회 중첩시 각각 10 또는 25의 추가 적응형 능력치를 획득했습니다.
                </p>
              </div>
            </div>
            <div>
              <strong>활성화 능력:</strong>
              <ul className="active-stats-list">
                {activeStats.map(stat => (
                  <li key={stat} className="active-stat-item">
                    <span className="stat-icon">✔️</span> {statTranslation[stat]}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>비활성화 능력치:</strong>
              <ul className="inactive-stats-list">
                {inactiveStats.map(stat => (
                  <li key={stat} className="inactive-stat-item">
                    <span className="stat-icon">❌</span> {statTranslation[stat]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div>
            <h2 style={{ margin: 0 }}>전체 아이템</h2>
            <div className="search-container">
              <label htmlFor="search">검색:</label>
              <input
                type="text"
                id="search"
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="아이템 이름이나 다른 이름(예: 똥신)으로 검색"
              />
            </div>
          </div>
          <div>
            <h3>카테고리 필터:</h3>
            <div className="filter-options">
              {Object.keys(categoryTranslation).map((tag) => (
                <button
                  key={tag}
                  className={`filter-button ${activeFilter.type === 'category' && activeFilter.value === tag ? 'active' : ''}`}
                  onClick={() => handleCategoryButtonClick(tag)}
                >
                  {categoryTranslation[tag]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3>다재다능 필터:</h3>
            <div className="filter-options">
              {jackOfAllTradesStats.map((stat) => (
                <button
                  key={stat}
                  className={`filter-button ${activeFilter.type === 'jack' && activeFilter.value === stat ? 'active' : ''}`}
                  onClick={() => handleJackOfAllTradesFilterClick(stat)}
                >
                  {statTranslation[stat]}
                </button>
              ))}
            </div>
          </div>
          <div className="item-list" ref={itemListRef}>
            {filterItems(
              filterItemsBySearch(items, searchQuery)
            ).map(([id, item]) => (
              <div
                key={id}
                className="item"
                onClick={() => handleItemClick(id)}
                onMouseEnter={(e) => handleItemMouseEnter(id, e)}
                onMouseLeave={handleItemMouseLeave}
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                  alt={item.name}
                />
                {hoveredItem === id && (
                  <Overlay position={overlayPosition}>
                    {renderOverlayContent(id)}
                  </Overlay>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="footer">
        <p style={{ fontSize: '0.75em' }}>
          EN: Item Builder(Jack of All Trades Simulator) is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.<br />
          KR: 롤 아이템 빌더(다재다능 시뮬레이터)는 Riot Games와 연관이 없으며, Riot Games 또는 라이엇 게임즈 자산을 생산 및 관리하는 그 어떤 곳과도 공식적인 관계가 없습니다. Riot Games 및 모든 관련 자산은 Riot Games, Inc.의 상표 또는 등록 상표입니다.
        </p>
      </footer>
    </div>
  );
};

export default App;