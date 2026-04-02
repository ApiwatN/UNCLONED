'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, ShoppingBag, DollarSign, Activity, Tag, CheckCircle, AlertCircle, Users, Clock, Calendar, BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [datePreset, setDatePreset] = useState('all');

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            let url = '/api/admin/analytics';
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (params.toString()) url += `?${params.toString()}`;
            
            const res = await axios.get(url);
                setData(res.data);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchAnalytics();
    }, [startDate, endDate]);

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setDatePreset(val);
        const now = new Date();
        if (val === 'all') {
            setStartDate(''); setEndDate('');
        } else if (val === 'today') {
            const todayStr = now.toISOString().split('T')[0];
            setStartDate(todayStr); setEndDate(todayStr);
        } else if (val === '7days') {
            const past = new Date(now); past.setDate(past.getDate() - 7);
            setStartDate(past.toISOString().split('T')[0]); setEndDate(now.toISOString().split('T')[0]);
        } else if (val === '30days') {
            const past = new Date(now); past.setDate(past.getDate() - 30);
            setStartDate(past.toISOString().split('T')[0]); setEndDate(now.toISOString().split('T')[0]);
        } else if (val === 'this_month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 2); // Avoid timezone shift to prev month by adding 1 day basically, or use local.
            // Better to carefully build local string
            const pad = (n: number) => n.toString().padStart(2, '0');
            const startStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`;
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const endStr = `${end.getFullYear()}-${pad(end.getMonth()+1)}-${pad(end.getDate())}`;
            setStartDate(startStr); setEndDate(endStr);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center items-center text-gray-500 h-[60vh] gap-3 animate-pulse"><Activity /> กำลังโหลดข้อมูลมิติการวิเคราะห์ระดับลึก...</div>;
    }

    // Helper for rendering css bar charts
    const renderBarChart = (title: React.ReactNode, dataObj: Record<string, number>, colorClass: string) => {
        if (!dataObj) return null;
        const entries = Object.entries(dataObj);
        const maxVal = Math.max(...entries.map(e => e[1])) || 1;

        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">{title}</h3>
                <div className="space-y-3">
                    {entries.map(([label, val]) => (
                        <div key={label} className="text-xs group">
                            <div className="flex justify-between text-gray-500 mb-1">
                                <span>{label}</span>
                                <span className="font-medium text-gray-800">฿{val.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className={`h-2 rounded-full ${colorClass} transition-all duration-1000 group-hover:opacity-80`} style={{ width: `${(val / maxVal) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-craft-600" />
                        ศูนย์วิเคราะห์ข้อมูลเชิงลึก (Deep Analytics)
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">วิเคราะห์ยอดขาย, ลูกค้า, ช่วงเวลาทอง, และประสิทธิภาพแคมเปญ</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <select 
                        value={datePreset}
                        onChange={handlePresetChange}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-craft-500 focus:border-craft-500 block p-2 outline-none"
                    >
                        <option value="all">ตั้งเเต่ต้น (All time)</option>
                        <option value="today">วันนี้</option>
                        <option value="7days">7 วันที่ผ่านมา</option>
                        <option value="30days">30 วันที่ผ่านมา</option>
                        <option value="this_month">เดือนนี้</option>
                        <option value="custom">กำหนดเอง...</option>
                    </select>
                    
                    {datePreset === 'custom' && (
                        <div className="flex items-center gap-2 text-sm">
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-700 rounded-md p-1.5 outline-none focus:border-craft-500"
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-700 rounded-md p-1.5 outline-none focus:border-craft-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 1. Top Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <span className="text-gray-500 font-medium text-xs">รายได้รวมทั้งหมด (Revenue)</span>
                    <div className="text-2xl font-bold text-gray-800 mt-2 flex items-center">
                        <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                        ฿{(data?.totalRevenue || 0).toLocaleString()}
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <span className="text-gray-500 font-medium text-xs">ออเดอร์ทั้งหมด</span>
                    <div className="text-2xl font-bold text-gray-800 mt-2 flex items-center">
                        <ShoppingBag className="w-4 h-4 text-blue-500 mr-1" />
                        {data?.totalOrders || 0} รายการ
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <span className="text-gray-500 font-medium text-xs">Drop-off (รอชำระเงิน/ละทิ้งตะกร้า)</span>
                    <div className="text-2xl font-bold text-gray-800 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                        {data?.pendingOrders || 0} รายการ
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <span className="text-gray-500 font-medium text-xs">อัตราการชำระเงินสำเร็จ (Payment Conversion)</span>
                    <div className="text-2xl font-bold text-gray-800 mt-2 flex items-center">
                        <TrendingUp className="w-4 h-4 text-indigo-500 mr-1" />
                        {data?.promotions?.paymentConversionRate || 0}%
                    </div>
                    {/* Insight Text */}
                    <div className="text-[10px] text-gray-400 mt-1">*หากต่ำกว่า 50% แนะนำให้ทำโปรโมชั่นส่งฟรี (Free Shipping Code) หรือ Flash Sale</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 2. Customer Insights */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col col-span-1">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-purple-600"/> วิเคราะห์ฐานลูกค้า</h3>
                    
                    <div className="flex-1 flex flex-col justify-center gap-4">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="text-purple-800 text-sm font-medium">ลูกค้าที่ซื้อซ้ำ (Returning)</span>
                            <span className="font-bold text-purple-900 text-lg">{data?.customers?.returning || 0} คน</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                            <span className="text-indigo-800 text-sm font-medium">ลูกค้าใหม่ (New)</span>
                            <span className="font-bold text-indigo-900 text-lg">{data?.customers?.new || 0} คน</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-4 border border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs">Top Spender (ยอดซื้อสูงสุด/คน)</span>
                                <span className="font-bold text-gray-800 text-lg">฿{(data?.customers?.topSpenderValue || 0).toLocaleString()}</span>
                            </div>
                            <Tag className="text-yellow-500 w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            <strong>Insight:</strong> หาก <span className="text-purple-600">ลูกค้าซื้อซ้ำ</span> มีจำนวนน้อย ควรปล่อยโปรโมชั่นผ่าน Line OA หรือทำ Loyalty discount (เช่น แจกคูปองซื้อครบ 2,000 ลด 10%)
                        </p>
                    </div>
                </div>

                {/* 3. Product Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-craft-600"/> วิเคราะห์สินค้าที่สร้างยอดขายสูงสุด</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100">
                                    <th className="pb-3 font-medium">อันดับสินค้า</th>
                                    <th className="pb-3 font-medium">หมวดหมู่</th>
                                    <th className="pb-3 font-medium text-right">จำนวนชิ้นที่ขายได้</th>
                                    <th className="pb-3 font-medium text-right">สร้างรายได้ (฿)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.topProducts?.length > 0 ? (
                                    data.topProducts.map((p: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 font-medium text-gray-800 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-xs">{i+1}</div>
                                                {p.name}
                                            </td>
                                            <td className="py-3 text-gray-500 capitalize">{p.category}</td>
                                            <td className="py-3 text-right font-medium text-craft-700">{p.qty}</td>
                                            <td className="py-3 text-right font-bold text-green-600 tracking-tight">{(p.revenue).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="py-8 text-center text-gray-400">ยังไม่มีข้อมูลสินค้า</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 4. Time & Trends Analysis */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2"><Clock className="text-blue-500" /> วิเคราะห์ช่วงเวลาขายดี (Time-based Trends)</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {renderBarChart(<><Calendar className="w-4 h-4"/> ยอดขายตามวัน (จ.-อา.)</>, data?.timeAnalysis?.salesByDay, "bg-blue-400")}
                    {renderBarChart(<><Clock className="w-4 h-4"/> ช่วงเวลาทอง (ทุก 1 ชม.)</>, Object.fromEntries(Object.entries(data?.timeAnalysis?.salesByHour || {}).filter(([_,v]: any)=>v>0)) as Record<string, number>, "bg-orange-400")}
                    {renderBarChart(<><BarChart2 className="w-4 h-4"/> ยอดขายเติบโตรายเดือน</>, data?.timeAnalysis?.salesByMonth, "bg-craft-500")}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        <strong>Marketing Time Suggestion:</strong> ดูกราฟ <strong className="text-orange-600">"ช่วงเวลาทอง"</strong> ด้านบนเพื่อใช้วางแผนการยิง แอด Facebook/Instagram หรือบรอดแคสต์ LINE OA ในช่วงที่กราฟพุ่งสูง หรือก่อนที่กราฟจะขึ้น 1 ชั่วโมง จะช่วยเพิ่มโอกาสในการตัดสินใจซื้อ (Conversion Rate) ได้สูงที่สุด
                    </p>
                </div>
            </div>

        </div>
    );
}
