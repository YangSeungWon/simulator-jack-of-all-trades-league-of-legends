import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const statTranslation = {
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

// Function to strip HTML tags from a string, but keep <br> tags
const stripHtmlTags = (html) => {
  // Replace <br> tags with a placeholder
  const withPlaceholder = html.replace(/<br\s*\/?>/gi, '###BR###');
  
  // Create a temporary div element
  const div = document.createElement('div');
  div.innerHTML = withPlaceholder;
  
  // Get the text content
  let stripped = div.textContent || div.innerText || '';
  
  // Replace the placeholder back with <br> tags
  stripped = stripped.replace(/###BR###/g, '<br>');
  
  return stripped;
};

const categoryTranslation = {
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

const detailedStatTranslation = {
  'FlatHPPoolMod': '체력',
  'rFlatHPModPerLevel': '레벨당 체력',
  'FlatMPPoolMod': '마나',
  'rFlatMPModPerLevel': '레벨당 마나',
  'PercentHPPoolMod': '체력(%)',
  'PercentMPPoolMod': '마나(%)',
  'FlatHPRegenMod': '체력 재생',
  'rFlatHPRegenModPerLevel': '레벨당 체력 재생',
  'PercentHPRegenMod': '체력 재생(%)',
  'FlatMPRegenMod': '마나 재생',
  'rFlatMPRegenModPerLevel': '레벨당 마나 재생',
  'PercentMPRegenMod': '마나 재생(%)',
  'FlatArmorMod': '방어력',
  'rFlatArmorModPerLevel': '레벨당 방어력',
  'PercentArmorMod': '방어력(%)',
  'rFlatArmorPenetrationMod': '방어구 관통력',
  'rFlatArmorPenetrationModPerLevel': '레벨당 방어구 관통력',
  'rPercentArmorPenetrationMod': '방어구 관통력(%)',
  'rPercentArmorPenetrationModPerLevel': '레벨당 방어구 관통력(%)',
  'FlatPhysicalDamageMod': '공격력',
  'rFlatPhysicalDamageModPerLevel': '레벨당 공격력',
  'PercentPhysicalDamageMod': '공격력(%)',
  'FlatMagicDamageMod': '주문력',
  'rFlatMagicDamageModPerLevel': '레벨당 주문력',
  'PercentMagicDamageMod': '주문력(%)',
  'FlatMovementSpeedMod': '이동 속도',
  'rFlatMovementSpeedModPerLevel': '레벨당 이동 속도',
  'PercentMovementSpeedMod': '이동 속도(%)',
  'rPercentMovementSpeedModPerLevel': '레벨당 동 속도(%)',
  'FlatAttackSpeedMod': '공격 속도',
  'PercentAttackSpeedMod': '공격 속도(%)',
  'rPercentAttackSpeedModPerLevel': '레벨당 공격 속도(%)',
  'rFlatDodgeMod': '회피',
  'rFlatDodgeModPerLevel': '레벨당 회피',
  'PercentDodgeMod': '회피(%)',
  'FlatCritChanceMod': '치명타 확률',
  'rFlatCritChanceModPerLevel': '레벨당 치명타 확률',
  'PercentCritChanceMod': '치명타 확률(%)',
  'FlatCritDamageMod': '치명타 피해',
  'rFlatCritDamageModPerLevel': '레벨당 치명타 피해',
  'PercentCritDamageMod': '명타 피해(%)',
  'FlatBlockMod': '방어',
  'PercentBlockMod': '방어(%)',
  'FlatSpellBlockMod': '마법 저항력',
  'rFlatSpellBlockModPerLevel': '레벨당 마법 저항력',
  'PercentSpellBlockMod': '마법 저항력(%)',
  'FlatEXPBonus': '경험치 보너스',
  'PercentEXPBonus': '경험치 보너스(%)',
  'rPercentCooldownMod': '재사용 대기시간 감소(%)',
  'rPercentCooldownModPerLevel': '레벨당 재사용 대기시간 감소(%)',
  'rFlatTimeDeadMod': '사망 시간 감소',
  'rFlatTimeDeadModPerLevel': '레벨당 사망 시간 소',
  'rPercentTimeDeadMod': '사망 시간 감소(%)',
  'rPercentTimeDeadModPerLevel': '레벨당 사망 시간 감소(%)',
  'rFlatGoldPer10Mod': '10초당 골드',
  'rFlatMagicPenetrationMod': '마법 관통력',
  'rFlatMagicPenetrationModPerLevel': '레벨당 마법 관통력',
  'rPercentMagicPenetrationMod': '마법 관통(%)',
  'rPercentMagicPenetrationModPerLevel': '레벨당 마법 관통력(%)',
  'FlatEnergyRegenMod': '에너지 재생',
  'rFlatEnergyRegenModPerLevel': '레벨당 에너지 재생',
  'FlatEnergyPoolMod': '에너지',
  'rFlatEnergyModPerLevel': '레벨당 에너지',
  'PercentLifeStealMod': '생명력 흡수(%)',
  'PercentSpellVampMod': '주문 흡혈(%)'
};

function translateItemStats(itemStats) {
  const translatedStats = {};

  Object.entries(itemStats).forEach(([statKey, value]) => {
    const translatedKey = detailedStatTranslation[statKey] || statKey;
    translatedStats[translatedKey] = value;
  });

  return translatedStats;
}

function App() {
  const [items, setItems] = useState([]);
  const [version, setVersion] = useState('');
  const [selectedItems, setSelectedItems] = useState(Array(6).fill(null));
  const [debug, setDebug] = useState(false);
  const [sortTag, setSortTag] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [simplifiedView, setSimplifiedView] = useState(false);
  const [activeFilter, setActiveFilter] = useState(''); // New state to track active filter

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebug(params.get('debug') === 'true');

    const fetchVersion = async () => {
      try {
        const versionResponse = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
        const latestVersion = versionResponse.data[0];
        setVersion(latestVersion);

        const itemsResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/ko_KR/item.json`);
        const allItems = Object.entries(itemsResponse.data.data);
        const filteredItems = allItems.filter(([id, item]) => item.maps && item.maps[11] && item.gold.purchasable && item.gold.total > 0);
        setItems(filteredItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchVersion();
  }, []);

  const handleItemClick = (id) => {
    console.log(`Adding item with ID: ${id}`);
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

  const handleSelectedItemRemove = (index) => {
    console.log(`Removing item at index: ${index}`);
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = [...prevSelectedItems];
      newSelectedItems[index] = null;
      return newSelectedItems;
    });
  };

  const parseDescriptionForStats = (description) => {
    const stats = {};
    const regex = /(체력|기본 체력 재생|방어력|마법 저항력|강인함|공격력|공격 속도|치명타 확률|물리 관통력|생명력 흡수|스킬 가속|마나|기본 마나 재생|주문력|마법 관통력|이동 속도|체력 회복 및 보호막)\s+(\d+)(%?)/g;
    let match;
    while ((match = regex.exec(description)) !== null) {
      const stat = match[1];
      const value = parseInt(match[2], 10);
      const isPercentage = match[3] === '%';
      let statType;
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
    return stats;
  };

  const calculateTotalStats = () => {
    const totalStats = {};

    selectedItems.forEach(id => {
      if (id) {
        const item = items.find(([itemId]) => itemId === id);
        if (item && item[1].description) {
          const itemStats = parseDescriptionForStats(stripHtmlTags(item[1].description));
          Object.entries(itemStats).forEach(([stat, value]) => {
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
    const abilityHaste = stackCount; // 1 ability haste per stack
    const adaptiveBonus = stackCount >= 10 ? 25 : stackCount >= 5 ? 10 : 0;

    return { activeStats, inactiveStats, stackCount, abilityHaste, adaptiveBonus };
  };

  const { activeStats, inactiveStats, stackCount, abilityHaste, adaptiveBonus } = calculateJackOfAllTrades();

  // Function to sort items based on selected tag
  const sortItemsByTag = (items, tag) => {
    if (!tag) return items;
    return items.sort(([idA, itemA], [idB, itemB]) => {
      const hasTagA = itemA.tags.includes(tag);
      const hasTagB = itemB.tags.includes(tag);
      if (hasTagA && !hasTagB) return -1;
      if (!hasTagA && hasTagB) return 1;
      return 0;
    });
  };

  // Function to handle button click for category filter
  const handleCategoryButtonClick = (tag) => {
    setActiveFilter((prevFilter) => (prevFilter === tag ? '' : tag));
  };

  // Function to handle Jack of All Trades filter click
  const handleJackOfAllTradesFilterClick = (stat) => {
    setActiveFilter((prevFilter) => (prevFilter === stat ? '' : stat));
  };

  // Function to filter items based on active filter
  const filterItems = (items) => {
    if (!activeFilter) return items;

    if (categoryTranslation[activeFilter]) {
      // If the active filter is a category tag
      return items.filter(([id, item]) => item.tags.includes(activeFilter));
    } else if (jackOfAllTradesStats.includes(activeFilter)) {
      // If the active filter is a Jack of All Trades stat
      return items.filter(([id, item]) => {
        const itemStats = parseDescriptionForStats(stripHtmlTags(item.description));
        return itemStats[statTranslation[activeFilter]];
      });
    }

    return items;
  };

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to filter items based on search query
  const filterItemsBySearch = (items, query) => {
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

  const totalStats = calculateTotalStats();

  return (
    <div className={`App ${simplifiedView ? 'simplified' : ''}`}>
      <div className="header">
        <img src="logo512.png" alt="App Icon" className="app-icon" />
        <h1>League of Legends - Item Builder (다재다능 시뮬레이터)</h1>
      </div>
      <div className="content">
        <div className="left-panel">
          <div className="selected-items-container"> {/* New container for styling */}
            <div className="selected-items slot-container">
              {selectedItems
                .map((id, index) => {
                  if (id === null) {
                    return (
                      <div key={index} className="empty-slot">
                        {/* You can add a placeholder or just leave it empty */}
                      </div>
                    );
                  }

                  const item = items.find(([itemId]) => itemId === id);
                  return (
                    <div key={index} className="selected-item" onClick={() => handleSelectedItemRemove(index)}>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                        alt={`Item ${id}`}
                      />
                    </div>
                  );
                })
                .sort((a, b) => {
                  // Sort only the non-null items by price
                  if (a.props.className === 'empty-slot') return 1;
                  if (b.props.className === 'empty-slot') return -1;
                  
                  const itemA = items.find(([itemId]) => itemId === a.key);
                  const itemB = items.find(([itemId]) => itemId === b.key);

                  if (!itemA || !itemB) return 0; // Handle undefined items

                  console.log(`Comparing items: ${itemA[1].name} and ${itemB[1].name}`);
                  console.log(`Prices: ${itemA[1].gold.total} and ${itemB[1].gold.total}`);

                  return itemB[1].gold.total - itemA[1].gold.total;
                })}
              <button onClick={handleResetItems} className="reset-button">초기화</button>
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
            <div className="jack-container"> {/* New container for flexbox */}
              <img src="jack.webp" alt="Jack of All Trades" className="jack-image" />
              <div className="jack-description"> {/* New div for description */}
                <p style={{ fontSize: '0.75em' }}>
                  다재다능에서 얻는 능력치: 아이템으로 얻은 서로 다른 능력치 하나당 잭 중첩을 얻습니다. 
                  중첩 하나당 스킬 가속이 1 증가합니다. 5회 및 10회 중첩시 각각 10 또는 25의 추가 적응형 능력치를 획득합니다.
                </p>
              </div>
            </div>
            <div>
              <strong>활성화 능력치:</strong>
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
          <h1>전체 아이템</h1>
          <div>
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
              <button onClick={() => setSimplifiedView(!simplifiedView)}>
                {simplifiedView ? '상세 보기' : '간소화 보기'}
              </button>
            </div>
          </div>
          <div>
            <h3>카테고리 필터:</h3>
            <div className="filter-options">
              {Object.keys(categoryTranslation).map((tag) => (
                <button
                  key={tag}
                  className={`filter-button ${activeFilter === tag ? 'active' : ''}`}
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
                  className={`filter-button ${activeFilter === stat ? 'active' : ''}`}
                  onClick={() => handleJackOfAllTradesFilterClick(stat)}
                >
                  {statTranslation[stat]}
                </button>
              ))}
            </div>
          </div>
          <div className="item-list">
            {filterItems(
              filterItemsBySearch(items, searchQuery)
            ).map(([id, item]) => (
              <div key={id} className="item" onClick={() => handleItemClick(id)}>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`}
                  alt={item.name}
                />
                {!simplifiedView && (
                  <div className="item-details">
                    <h2>
                      {item.name}<br />
                      {item.colloq && <span className="colloq-name"> ({item.colloq})</span>}
                    </h2>
                    {debug && <p>ID: {id}</p>}
                    <p><b>가격:</b> {item.gold.total} 골드</p>
                    <p><i>{item.plaintext}</i></p>
                    <p><strong>효과</strong><br />{stripHtmlTags(item.description).split('<br>').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}</p>
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
                      <strong>하위 이템:</strong>
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;