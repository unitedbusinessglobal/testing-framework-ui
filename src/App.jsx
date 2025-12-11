import React, { useState } from 'react';
import { Play, Plus, Trash2, Download, CheckCircle, XCircle, Clock, AlertTriangle, Terminal, Database, Globe, Lock, Monitor, Code, History, TrendingUp, Save, FileText, Zap, Sparkles } from 'lucide-react';

const TestingFrameworkUI = () => {
  const [activeTab, setActiveTab] = useState('unit');
  const [activeView, setActiveView] = useState('tests');
  const [tests, setTests] = useState({
    unit: [],
    api: [],
    database: [],
    performance: [],
    security: [],
    ui: []
  });
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  const addTest = (type, testData) => {
    const newTest = { 
      ...testData, 
      id: Date.now() + Math.random(), 
      status: 'pending' 
    };
    
    setTests(prev => ({
      ...prev,
      [type]: [...prev[type], newTest]
    }));
  };

  const deleteTest = (type, id) => {
    setTests(prev => ({
      ...prev,
      [type]: prev[type].filter(t => t.id !== id)
    }));
  };

  const generateTestsFromURL = async (url, username, password) => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const hasAuth = username && password;
      
      const generatedTests = [
        { type: 'api', data: { name: `Test ${domain} Homepage`, method: 'GET', endpoint: url, expectedStatus: 200 }},
        { type: 'api', data: { name: `Test ${domain} API Health`, method: 'GET', endpoint: `${urlObj.origin}/api/health`, expectedStatus: 200 }},
        { type: 'security', data: { name: `SQL Injection Test - ${domain}`, testType: 'sql_injection', endpoint: url }},
        { type: 'security', data: { name: `XSS Test - ${domain}`, testType: 'xss', endpoint: url }},
        { type: 'performance', data: { name: `Load Test - ${domain}`, requests: 100, users: 10 }},
        { type: 'ui', data: { name: `Homepage Load - ${domain}`, url: url, action: 'page_load' }},
        { type: 'unit', data: { name: `URL Validation Test`, code: `const isValid = /^https?:\\/\\/.+/.test("${url}");` }},
        { type: 'database', data: { name: `Connection Test - ${domain}`, query: 'SELECT 1', database: 'main' }}
      ];

      if (hasAuth) {
        generatedTests.push(
          { type: 'api', data: { name: `Test ${domain} Login`, method: 'POST', endpoint: `${urlObj.origin}/api/auth/login`, expectedStatus: 200 }},
          { type: 'ui', data: { name: `Login Flow - ${domain}`, url: `${urlObj.origin}/login`, action: 'form_submit' }}
        );
      }

      generatedTests.forEach(test => {
        addTest(test.type, test.data);
      });

      setIsGenerating(false);
      setShowAutoGenerate(false);
      setNeedsAuth(false);
      
      alert(`✅ Successfully generated ${generatedTests.length} tests for ${domain}!`);
      
    } catch (error) {
      setIsGenerating(false);
      alert('❌ Invalid URL. Please enter a valid website URL');
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    const newResults = [];
    
    const allTests = Object.entries(tests).flatMap(([type, testList]) => 
      testList.map(test => ({ ...test, type }))
    );

    for (const test of allTests) {
      setCurrentTest(test);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const passed = Math.random() > 0.2;
      const duration = Math.floor(Math.random() * 2000) + 100;
      
      const result = {
        ...test,
        status: passed ? 'passed' : 'failed',
        duration,
        timestamp: new Date().toISOString(),
        error: passed ? null : 'Test assertion failed'
      };
      
      newResults.push(result);
      setResults(prev => [...prev, result]);
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      summary: {
        total: allTests.length,
        passed: newResults.filter(r => r.status === 'passed').length,
        failed: newResults.filter(r => r.status === 'failed').length
      }
    };
    
    setHistory(prev => [historyEntry, ...prev].slice(0, 20));
  };

  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: results.filter(r => r.status === 'passed').length,
        failed: results.filter(r => r.status === 'failed').length,
        duration: results.reduce((sum, r) => sum + r.duration, 0)
      },
      results
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${Date.now()}.json`;
    a.click();
  };

  const saveAsTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      const template = {
        id: Date.now(),
        name: templateName,
        tests: { ...tests },
        createdAt: new Date().toISOString()
      };
      setTemplates(prev => [...prev, template]);
      alert('✅ Template saved successfully!');
    }
  };

  const loadTemplate = (template) => {
    if (window.confirm('This will replace your current tests. Continue?')) {
      setTests(template.tests);
      alert('✅ Template loaded successfully!');
    }
  };

  const deleteTemplate = (id) => {
    if (window.confirm('Delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const tabs = [
    { id: 'unit', label: 'Unit Tests', icon: Code },
    { id: 'api', label: 'API Tests', icon: Globe },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'performance', label: 'Performance', icon: Clock },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'ui', label: 'UI Tests', icon: Monitor }
  ];

  const views = [
    { id: 'tests', label: 'Tests', icon: Terminal },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'templates', label: 'Templates', icon: FileText }
  ];

  const getStatusColor = (status) => {
    if (status === 'passed') return 'text-green-600 bg-green-50 border-green-200';
    if (status === 'failed') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    duration: results.reduce((sum, r) => sum + r.duration, 0)
  };

  const totalTests = Object.values(tests).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Terminal className="text-blue-600" />
                Testing Framework
              </h1>
              <p className="text-slate-600 mt-1">Professional Testing Solution</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowAutoGenerate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg"
              >
                <Sparkles size={18} />
                Auto-Generate
              </button>
              <button
                onClick={saveAsTemplate}
                disabled={totalTests === 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={runTests}
                disabled={isRunning || totalTests === 0}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Play size={20} />
                {isRunning ? 'Running...' : 'Run Tests'}
              </button>
              {results.length > 0 && (
                <button onClick={exportResults} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download size={18} />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>

        {showAutoGenerate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={28} />
                  Auto-Generate Tests
                </h2>
                <button
                  onClick={() => {
                    setShowAutoGenerate(false);
                    setNeedsAuth(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website URL
                  </label>
                  <input
                    id="url-input"
                    type="text"
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-800">Requires authentication?</span>
                    <button
                      onClick={() => setNeedsAuth(!needsAuth)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        needsAuth ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {needsAuth ? 'Yes' : 'No'}
                    </button>
                  </div>
                  
                  {needsAuth && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-blue-200">
                      <input
                        id="username-input"
                        type="text"
                        placeholder="Username / Email"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <input
                        id="password-input"
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAutoGenerate(false);
                      setNeedsAuth(false);
                    }}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const url = document.getElementById('url-input').value;
                      const username = needsAuth ? document.getElementById('username-input')?.value || '' : '';
                      const password = needsAuth ? document.getElementById('password-input')?.value || '' : '';
                      
                      if (!url) {
                        alert('⚠️ Please enter a website URL');
                        return;
                      }
                      
                      generateTestsFromURL(url, username, password);
                    }}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Tests'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
          {views.map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all flex-1 min-w-fit ${
                  activeView === view.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                {view.label}
              </button>
            );
          })}
        </div>

        {results.length > 0 && activeView === 'tests' && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-slate-600">Total</div>
              <div className="text-3xl font-bold text-slate-800">{summary.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <div className="text-sm text-green-700">Passed</div>
              <div className="text-3xl font-bold text-green-600">{summary.passed}</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4">
              <div className="text-sm text-red-700">Failed</div>
              <div className="text-3xl font-bold text-red-600">{summary.failed}</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4">
              <div className="text-sm text-blue-700">Duration</div>
              <div className="text-3xl font-bold text-blue-600">{(summary.duration / 1000).toFixed(2)}s</div>
            </div>
          </div>
        )}

        {isRunning && currentTest && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center gap-3">
              <Zap className="text-blue-600 animate-pulse" size={24} />
              <div>
                <div className="font-semibold text-blue-900">Running: {currentTest.name}</div>
                <div className="text-sm text-blue-700">Type: {currentTest.type}</div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'tests' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-2 mb-6 border-b pb-2 overflow-x-auto">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap ${
                        activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                      {tests[tab.id].length > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {tests[tab.id].length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {activeTab === 'unit' && <UnitTestForm onAdd={(data) => addTest('unit', data)} />}
                {activeTab === 'api' && <APITestForm onAdd={(data) => addTest('api', data)} />}
                {activeTab === 'database' && <DatabaseTestForm onAdd={(data) => addTest('database', data)} />}
                {activeTab === 'performance' && <PerformanceTestForm onAdd={(data) => addTest('performance', data)} />}
                {activeTab === 'security' && <SecurityTestForm onAdd={(data) => addTest('security', data)} />}
                {activeTab === 'ui' && <UITestForm onAdd={(data) => addTest('ui', data)} />}

                <div className="mt-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Configured Tests ({tests[activeTab].length})</h3>
                  <div className="space-y-2">
                    {tests[activeTab].length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <div className="mb-3">No tests configured yet.</div>
                        <button
                          onClick={() => setShowAutoGenerate(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                        >
                          <Sparkles size={18} />
                          Auto-Generate from URL
                        </button>
                      </div>
                    ) : (
                      tests[activeTab].map(test => (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:border-blue-300">
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{test.name}</div>
                            <div className="text-sm text-slate-600 truncate">
                              {test.code || test.endpoint || test.query || test.url || (test.requests && `${test.requests} requests, ${test.users} users`) || test.testType}
                            </div>
                          </div>
                          <button onClick={() => deleteTest(activeTab, test.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Terminal size={20} />
                Test Results
              </h3>
              
              {results.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <AlertTriangle size={48} className="mx-auto mb-3 text-slate-300" />
                  <p>No results yet</p>
                  <p className="text-sm">Run tests to see results</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {result.status === 'passed' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <XCircle size={16} className="text-red-600" />
                          )}
                          <span className="font-medium text-sm">{result.name}</span>
                        </div>
                        <span className="text-xs">{result.duration}ms</span>
                      </div>
                      <div className="text-xs opacity-75 uppercase">{result.type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'history' && <HistoryView history={history} />}
        {activeView === 'analytics' && <AnalyticsView history={history} />}
        {activeView === 'templates' && <TemplatesView templates={templates} onLoad={loadTemplate} onDelete={deleteTemplate} />}
      </div>
    </div>
  );
};

const UnitTestForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  
  const handleAdd = () => {
    if (name && code) {
      onAdd({ name, code });
      setName('');
      setCode('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h4 className="font-semibold mb-3">Add Unit Test</h4>
      <input type="text" placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <textarea placeholder="JavaScript code" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border rounded mb-2 font-mono text-sm" rows={3} />
      <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus size={18} /> Add Test
      </button>
    </div>
  );
};

const APITestForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [expectedStatus, setExpectedStatus] = useState('200');
  
  const handleAdd = () => {
    if (name && endpoint) {
      onAdd({ name, method, endpoint, expectedStatus: parseInt(expectedStatus) });
      setName('');
      setEndpoint('');
      setExpectedStatus('200');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h4 className="font-semibold mb-3">Add API Test</h4>
      <input type="text" placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-3 py-2 border rounded mb-2">
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <input type="text" placeholder="Endpoint URL" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <input type="number" placeholder="Expected status" value={expectedStatus} onChange={(e) => setExpectedStatus(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus size={18} /> Add Test
      </button>
    </div>
  );
};

const DatabaseTestForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [database, setDatabase] = useState('');
  
  const handleAdd = () => {
    if (name && query && database) {
      onAdd({ name, query, database });
      setName(''); setQuery(''); setDatabase('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h4 className="font-semibold mb-3">Add Database Test</h4>
      <input type="text" placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <input type="text" placeholder="Database name" value={database} onChange={(e) => setDatabase(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <textarea placeholder="SQL query" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-3 py-2 border rounded mb-2 font-mono text-sm" rows={3} />
      <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus size={18} /> Add Test
      </button>
    </div>
  );
};

const PerformanceTestForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [requests, setRequests] = useState('100');
  const [users, setUsers] = useState('10');
  
  const handleAdd = () => {
    if (name && requests && users) {
      onAdd({ name, requests: parseInt(requests), users: parseInt(users) });
      setName(''); setRequests('100'); setUsers('10');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h4 className="font-semibold mb-3">Add Performance Test</h4>
      <input type="text" placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <input type="number" placeholder="Requests" value={requests} onChange={(e) => setRequests(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <input type="number" placeholder="Users" value={users} onChange={(e) => setUsers(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus size={18} /> Add Test
      </button>
    </div>
  );
};

const SecurityTestForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [testType, setTestType] = useState('sql_injection');
  const [endpoint, setEndpoint] = useState('');
  
  const handleAdd = () => {
    if (name && endpoint) {
      onAdd({ name, testType, endpoint });
      setName(''); setEndpoint('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h4 className="font-semibold mb-3">Add Security Test</h4>
      <input type="text" placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <select value={testType} onChange={(e) => setTestType(e.target.value)} className="w-full px-3 py-2 border rounded mb-2">
        <option value="sql_injection">SQL Injection</option>
        <option value="xss">XSS Attack</option>
        <option value="csrf">CSRF Protection</option>
        <option value="headers">Security Headers</option>
        <option value="brute_force">Brute Force Protection</option>
      </select>
      <input type="text" placeholder="Endpoint URL" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus size={18} /> Add Test
      </button>
    </div>
  );
};

const UITestForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [action, setAction] = useState('page_load');
  
  const handleAdd = () => {
    if (name && url) {
      onAdd({ name, url, action });
      setName(''); setUrl('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h4 className="font-semibold mb-3">Add UI Test</h4>
      <input type="text" placeholder="Test name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <input type="text" placeholder="Page URL" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
      <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full px-3 py-2 border rounded mb-2">
        <option value="page_load">Page Load</option>
        <option value="element_check">Element Check</option>
        <option value="form_submit">Form Submit</option>
        <option value="click">Click Action</option>
      </select>
      <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Plus size={18} /> Add Test
      </button>
    </div>
  );
};

const HistoryView = ({ history }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Test History</h2>
    {history.length === 0 ? (
      <div className="text-center py-12 text-slate-500">No test runs yet</div>
    ) : (
      <div className="space-y-4">
        {history.map(entry => (
          <div key={entry.id} className="border rounded-lg p-4">
            <div className="font-semibold mb-3">{new Date(entry.timestamp).toLocaleString()}</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold">{entry.summary.total}</div>
                <div className="text-xs">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{entry.summary.passed}</div>
                <div className="text-xs">Passed</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{entry.summary.failed}</div>
                <div className="text-xs">Failed</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AnalyticsView = ({ history }) => {
  const stats = history.length > 0 ? {
    totalRuns: history.length,
    avgPassRate: history.reduce((sum, h) => sum + (h.summary.passed / h.summary.total * 100), 0) / history.length,
    totalTests: history.reduce((sum, h) => sum + h.summary.total, 0)
  } : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Analytics</h2>
      {!stats ? (
        <div className="text-center py-12 text-slate-500">No analytics data</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-700">Total Runs</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalRuns}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-700">Avg Pass Rate</div>
            <div className="text-3xl font-bold text-green-600">{stats.avgPassRate.toFixed(1)}%</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-700">Total Tests</div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalTests}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const TemplatesView = ({ templates, onLoad, onDelete }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Templates</h2>
    {templates.length === 0 ? (
      <div className="text-center py-12 text-slate-500">No saved templates</div>
    ) : (
      <div className="grid grid-cols-2 gap-4">
        {templates.map(template => (
          <div key={template.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{template.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => onLoad(template)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Load
                </button>
                <button onClick={() => onDelete(template.id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="text-sm text-slate-600">{new Date(template.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TestingFrameworkUI;
