import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLotteryStore, Prize } from './store';
import { Settings, Users, Gift, Save, ArrowLeft, Trash2, Plus } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { employees, prizes, updateEmployees, updatePrizes, isLoaded } = useLotteryStore();
  
  const [employeeInput, setEmployeeInput] = useState('');
  const [editingPrizes, setEditingPrizes] = useState<Prize[]>([]);
  const [activeTab, setActiveTab] = useState<'employees' | 'prizes'>('employees');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize local state once store is loaded
  if (isLoaded && !isInitialized) {
    setEmployeeInput(employees.join('\n'));
    setEditingPrizes([...prizes]);
    setIsInitialized(true);
  }

  const handleSaveEmployees = () => {
    // Split by newline, comma, or space, remove empty strings, and trim
    const newEmployees = employeeInput
      .split(/[\n,，\s]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    // Remove duplicates
    const uniqueEmployees = Array.from(new Set(newEmployees)) as string[];
    
    updateEmployees(uniqueEmployees);
    alert('人员名单保存成功！');
  };

  const handleSavePrizes = () => {
    updatePrizes(editingPrizes);
    alert('奖项配置保存成功！');
  };

  const addPrize = () => {
    setEditingPrizes([
      ...editingPrizes,
      { id: `prize-${Date.now()}`, name: '新奖项', count: 1 }
    ]);
  };

  const removePrize = (index: number) => {
    const newPrizes = [...editingPrizes];
    newPrizes.splice(index, 1);
    setEditingPrizes(newPrizes);
  };

  const updatePrizeField = (index: number, field: keyof Prize, value: string | number) => {
    const newPrizes = [...editingPrizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setEditingPrizes(newPrizes);
  };

  if (!isLoaded) return <div className="min-h-screen bg-red-900 text-white flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-red-950 text-white font-sans p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-red-800 pb-4">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-yellow-500">抽奖后台管理</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 rounded-lg transition-colors border border-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            返回抽奖大厅
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-colors ${
              activeTab === 'employees' 
                ? 'bg-red-900 text-yellow-400 border-t border-l border-r border-red-700' 
                : 'bg-red-950 text-red-400 hover:bg-red-900/50'
            }`}
          >
            <Users className="w-5 h-5" />
            人员名单管理
          </button>
          <button
            onClick={() => setActiveTab('prizes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-colors ${
              activeTab === 'prizes' 
                ? 'bg-red-900 text-yellow-400 border-t border-l border-r border-red-700' 
                : 'bg-red-950 text-red-400 hover:bg-red-900/50'
            }`}
          >
            <Gift className="w-5 h-5" />
            奖项设置
          </button>
        </div>

        {/* Content */}
        <div className="bg-red-900 p-8 rounded-b-xl rounded-tr-xl border border-red-700 shadow-2xl">
          
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">导入人员名单</h2>
                  <p className="text-red-300 text-sm">
                    请在下方文本框中输入参与抽奖的人员名单。支持换行、逗号或空格分隔。
                    系统会自动去除重复项和空白字符。
                  </p>
                </div>
                <div className="text-yellow-500 font-mono bg-red-950 px-4 py-2 rounded-lg border border-red-800">
                  当前识别: {employeeInput.split(/[\n,，\s]+/).filter(n => n.trim()).length} 人
                </div>
              </div>
              
              <textarea
                value={employeeInput}
                onChange={(e) => setEmployeeInput(e.target.value)}
                className="w-full h-96 bg-red-950 border border-red-700 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 custom-scrollbar"
                placeholder="张三&#10;李四&#10;王五"
              />
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveEmployees}
                  className="flex items-center gap-2 px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-red-950 font-bold rounded-lg transition-colors shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  保存名单
                </button>
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-yellow-400 mb-2">奖项与人数配置</h2>
                <p className="text-red-300 text-sm">
                  配置抽奖的轮次和每轮抽取的人数。抽奖时将按照从上到下的顺序依次进行（通常建议小奖在上面，大奖在下面，因为抽奖是从列表第一个开始抽）。
                </p>
              </div>

              <div className="space-y-4">
                {editingPrizes.map((prize, index) => (
                  <div key={prize.id} className="flex items-center gap-4 bg-red-950 p-4 rounded-xl border border-red-800">
                    <div className="flex-1">
                      <label className="block text-red-400 text-xs mb-1">奖项名称</label>
                      <input
                        type="text"
                        value={prize.name}
                        onChange={(e) => updatePrizeField(index, 'name', e.target.value)}
                        className="w-full bg-red-900 border border-red-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                        placeholder="例如：一等奖"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-red-400 text-xs mb-1">中奖人数</label>
                      <input
                        type="number"
                        min="1"
                        value={prize.count}
                        onChange={(e) => updatePrizeField(index, 'count', parseInt(e.target.value) || 1)}
                        className="w-full bg-red-900 border border-red-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div className="pt-5">
                      <button
                        onClick={() => removePrize(index)}
                        className="p-2 text-red-400 hover:text-red-200 hover:bg-red-900 rounded-lg transition-colors"
                        title="删除奖项"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-red-800">
                <button
                  onClick={addPrize}
                  className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-yellow-400 rounded-lg transition-colors border border-red-600"
                >
                  <Plus className="w-4 h-4" />
                  添加奖项
                </button>
                
                <button
                  onClick={handleSavePrizes}
                  className="flex items-center gap-2 px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-red-950 font-bold rounded-lg transition-colors shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  保存奖项配置
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
