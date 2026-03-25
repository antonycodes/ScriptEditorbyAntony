import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, FileText, User, School, Mic2, Layout, Type, Info, Tag } from 'lucide-react';

const App = () => {
  const [metadata, setMetadata] = useState({
    schoolName: '',
    speakerName: '',
    mcName: '',
    eventTitle: 'KỊCH BẢN CHƯƠNG TRÌNH'
  });

  const [sections, setSections] = useState([
    { id: '1', title: 'MỞ ĐẦU', content: 'Kính thưa quý vị, tôi là [MC]. Chào mừng quý vị đến với [SU_KIEN] tại [TRUONG]. Hôm nay chúng ta có sự hiện diện của diễn giả [DIEN_GIA].' },
    { id: '2', title: 'NỘI DUNG CHÍNH', content: 'Tiếp theo chương trình, xin mời quý vị cùng lắng nghe phần chia sẻ từ [DIEN_GIA].' }
  ]);

  const addSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setSections([...sections, { id: newId, title: '', content: '' }]);
  };

  const removeSection = (id) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateMetadata = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
  };

  const processPlaceholders = (text) => {
    if (!text) return '';
    return text
      .replace(/\[TRUONG\]/g, metadata.schoolName || '..........')
      .replace(/\[MC\]/g, metadata.mcName || '..........')
      .replace(/\[DIEN_GIA\]/g, metadata.speakerName || '..........')
      .replace(/\[SU_KIEN\]/g, metadata.eventTitle || '..........');
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToDoc = () => {
    const printElement = document.getElementById('mc-script-print');
    // We construct a special Word-compatible HTML string
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Kịch bản MC</title>
        <style>
          @page Section1 {
            size: 14.8cm 21.0cm; /* A5 Size */
            margin: 1.5cm 1.0cm 1.5cm 1.0cm;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; }
          h1 { text-align: center; text-transform: uppercase; font-size: 18pt; margin-bottom: 20pt; }
          h2 { text-align: center; text-transform: uppercase; font-size: 12pt; margin-bottom: 5pt; }
          h3 { border-left: 6px solid black; padding-left: 10px; text-transform: uppercase; font-size: 16pt; margin-top: 20pt; }
          .page-break { page-break-before: always; mso-special-character: page-break; }
          .metadata-box { border: 1pt solid black; padding: 10pt; margin: 20pt 0; }
        </style>
      </head>
      <body>
        <div class="Section1">
    `;

    // Create the content with explicit page breaks for Word
    let contentHtml = `
      <h2>${metadata.schoolName || ''}</h2>
      <h1>${metadata.eventTitle}</h1>
      <div class="metadata-box">
        <p><strong>Diễn giả:</strong> ${metadata.speakerName || '..........'}</p>
        <p><strong>Người dẫn (MC):</strong> ${metadata.mcName || '..........'}</p>
      </div>
    `;

    sections.forEach((section, index) => {
      // Adding page break before each section
      contentHtml += `<div class="page-break"></div>`;
      contentHtml += `<h3>${index + 1}. ${section.title || 'PHẦN ' + (index + 1)}</h3>`;
      contentHtml += `<p style="text-align: justify;">${processPlaceholders(section.content).replace(/\n/g, '<br/>')}</p>`;
    });

    const footer = `
        </div>
      </body>
      </html>
    `;
    
    const sourceHTML = header + contentHtml + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = url;
    fileDownload.download = 'Kich-Ban-MC-A5.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
    URL.revokeObjectURL(url);
  };

  const insertTag = (sectionId, tag) => {
    const section = sections.find(s => s.id === sectionId);
    updateSection(sectionId, 'content', section.content + ` [${tag}] `);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden print:hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Layout className="w-6 h-6" /> SCRIPT EDITOR BY ANTONY V.1
            </h1>
            <p className="opacity-80 text-sm mt-1">Khổ A5 • Font 14pt • Xuất Word & PDF</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Area */}
          <div className="lg:col-span-1 space-y-6 border-r border-gray-100 pr-0 lg:pr-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-sm tracking-wider">
              <Info className="w-4 h-4 text-blue-600" /> Cài đặt chung
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Tên Trường</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={metadata.schoolName}
                  onChange={(e) => updateMetadata('schoolName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Sự Kiện</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={metadata.eventTitle}
                  onChange={(e) => updateMetadata('eventTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Diễn giả</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={metadata.speakerName}
                  onChange={(e) => updateMetadata('speakerName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">MC</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={metadata.mcName}
                  onChange={(e) => updateMetadata('mcName', e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl text-blue-800 text-xs">
              <p>📌 <strong>Lưu ý:</strong> Mỗi "Phần" bạn thêm bên phải sẽ tự động nằm ở <strong>đầu một trang mới</strong> khi in hoặc xuất Word.</p>
            </div>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Các phân đoạn kịch bản</h2>
              <button onClick={addSection} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Thêm trang mới
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {sections.map((section, index) => (
                <div key={section.id} className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl relative group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                       <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded">TRANG {index + 2}</span>
                       <input
                        type="text"
                        className="font-bold text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-blue-300"
                        placeholder="Tiêu đề trang mới..."
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      />
                    </div>
                    <button onClick={() => removeSection(section.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg min-h-[100px] outline-none text-sm"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  />

                  <div className="flex flex-wrap gap-2 mt-2">
                    {['TRUONG', 'MC', 'DIEN_GIA', 'SU_KIEN'].map(tag => (
                      <button key={tag} onClick={() => insertTag(section.id, tag)} className="text-[9pt] bg-white border px-2 py-0.5 rounded hover:bg-blue-50 hover:text-blue-600">
                        [{tag}]
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button onClick={handlePrint} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg">
                <Printer className="w-5 h-5" /> In ngay (A5 PDF)
              </button>
              <button onClick={exportToDoc} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg">
                <FileText className="w-5 h-5" /> Xuất File Word A5
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT ENGINE */}
      <div id="mc-script-print" className="hidden print:block bg-white mx-auto print-container">
        <style>
          {`
            @media print {
              @page { size: A5 portrait; margin: 15mm 10mm 20mm 10mm; }
              body { background: white; font-family: 'Times New Roman', Times, serif; font-size: 14pt; }
              .print-container { display: block !important; width: 100%; color: black; line-height: 1.6; }
              .page-break { page-break-before: always; }
              .header-page { text-align: center; border-bottom: 2pt solid black; padding-bottom: 20pt; margin-bottom: 20pt; }
              
              /* Floating Headers/Footers */
              .fixed-header { position: fixed; top: 0; left: 0; right: 0; height: 10mm; font-size: 10pt; font-style: italic; border-bottom: 0.5pt solid #ccc; display: flex; justify-content: space-between; align-items: center; }
              .fixed-footer { position: fixed; bottom: 0; left: 0; right: 0; height: 15mm; font-size: 10pt; border-top: 0.5pt solid #ccc; text-align: center; padding-top: 5pt; }
              
              .page-number::after { content: "Trang " counter(page) " / " counter(pages); }
              body { counter-reset: page; }
            }
          `}
        </style>

        {/* Floating Header */}
        <div className="fixed-header">
          <span>{metadata.schoolName || 'Kịch bản'}</span>
          <span className="page-number"></span>
        </div>

        {/* Trang bìa / Thông tin đầu */}
        <div className="header-page pt-4">
          <p className="text-sm uppercase font-bold mb-1">{metadata.schoolName}</p>
          <h1 className="text-2xl font-black uppercase mb-6">{metadata.eventTitle}</h1>
          <div className="text-left border p-4 inline-block mx-auto min-w-[70%] bg-gray-50">
            <p><strong>Diễn giả:</strong> {metadata.speakerName || '..........................'}</p>
            <p><strong>Người dẫn (MC):</strong> {metadata.mcName || '..........................'}</p>
          </div>
        </div>

        {/* Nội dung các phần (Mỗi phần 1 trang) */}
        {sections.map((section, index) => (
          <div key={section.id} className="page-break">
            {section.title && (
              <h3 className="text-xl font-bold border-l-[8px] border-black pl-4 mb-4 uppercase mt-4">
                {index + 1}. {section.title}
              </h3>
            )}
            <div className="text-justify whitespace-pre-wrap leading-relaxed">
              {processPlaceholders(section.content)}
            </div>
          </div>
        ))}

        {/* Floating Footer */}
        <div className="fixed-footer">
          <p className="font-bold">{metadata.eventTitle}</p>
          <div className="flex justify-between px-4">
            <span>MC: {metadata.mcName}</span>
            <span className="page-number"></span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
