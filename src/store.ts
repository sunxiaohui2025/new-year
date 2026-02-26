import { useState, useEffect } from 'react';

export interface Prize {
  id: string;
  name: string;
  count: number;
}

const DEFAULT_EMPLOYEES = [
  "赵伟", "钱芳", "孙强", "李娜", "周勇", "吴敏", "郑杰", "王丽", "冯涛", "陈静",
  "褚明", "卫燕", "蒋华", "沈洋", "韩梅", "杨辉", "朱萍", "秦斌", "尤倩", "许飞",
  "何娟", "吕雷", "施红", "张伟", "孔玲", "曹阳", "严雪", "华健", "金鑫", "魏丹",
  "陶然", "姜波", "戚薇", "谢霆", "邹凯", "喻言", "柏林", "水清", "窦唯", "章子",
  "云龙", "苏菲", "潘安", "葛优", "奚梦", "范冰", "彭于", "郎朗", "鲁迅", "韦小",
  "昌平", "马云", "苗圃", "凤姐", "花木", "方舟", "俞敏", "任贤", "袁泉", "柳岩",
  "酆都", "鲍春", "史玉", "唐嫣", "费玉", "廉颇", "岑参", "薛之", "雷军", "贺龙",
  "倪妮", "汤唯", "滕王", "殷桃", "罗志", "毕福", "郝蕾", "邬君", "安以", "常远",
  "乐嘉", "于和", "时传", "傅园", "皮特", "卞之", "齐秦", "康辉", "伍佰", "余文",
  "元彪", "卜学", "顾长", "孟非", "平野", "黄渤", "和珅", "穆桂", "萧敬", "尹正"
];

const DEFAULT_PRIZES: Prize[] = [
  { id: '3rd', name: '三等奖', count: 10 },
  { id: '2nd', name: '二等奖', count: 5 },
  { id: '1st', name: '一等奖', count: 1 }
];

export function useLotteryStore() {
  const [employees, setEmployees] = useState<string[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('lottery_employees');
    const storedPrizes = localStorage.getItem('lottery_prizes');

    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch (e) {
        // Fallback if it was accidentally saved as a comma-separated string
        if (storedEmployees.includes(',')) {
          setEmployees(storedEmployees.split(','));
        } else {
          setEmployees(DEFAULT_EMPLOYEES);
        }
      }
    } else {
      setEmployees(DEFAULT_EMPLOYEES);
      localStorage.setItem('lottery_employees', JSON.stringify(DEFAULT_EMPLOYEES));
    }

    if (storedPrizes) {
      try {
        setPrizes(JSON.parse(storedPrizes));
      } catch (e) {
        setPrizes(DEFAULT_PRIZES);
      }
    } else {
      setPrizes(DEFAULT_PRIZES);
      localStorage.setItem('lottery_prizes', JSON.stringify(DEFAULT_PRIZES));
    }
    
    setIsLoaded(true);
  }, []);

  const updateEmployees = (newEmployees: string[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('lottery_employees', JSON.stringify(newEmployees));
  };

  const updatePrizes = (newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    localStorage.setItem('lottery_prizes', JSON.stringify(newPrizes));
  };

  return {
    employees,
    prizes,
    updateEmployees,
    updatePrizes,
    isLoaded
  };
}
