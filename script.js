window.addEventListener('DOMContentLoaded', function() {
    let materialsData = null;
    
    // 异步加载材料数据
    fetch('materials_db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载材料数据文件');
            }
            return response.json();
        })
        .then(data => {
            materialsData = data;
            populateMaterialSelector();
        })
        .catch(error => {
            console.error('加载数据时出错:', error);
            showError('无法加载材料数据，请检查数据文件是否存在。');
        });

    // 动态填充材料选择器
    function populateMaterialSelector() {
        const selector = document.getElementById('material-selector');
        
        // 清空现有选项
        selector.innerHTML = '<option value="">请选择材料...</option>';
        
        // 添加材料选项
        materialsData.materials.forEach(material => {
            const option = document.createElement('option');
            option.value = material.id;
            option.textContent = material.name;
            selector.appendChild(option);
        });
    }

    // 添加选择器变化事件监听
    document.getElementById('material-selector').addEventListener('change', function(event) {
        const selectedId = event.target.value;
        if (selectedId && materialsData) {
            const material = materialsData.materials.find(m => m.id === selectedId);
            if (material) {
                displayMaterialData(material);
            }
        } else {
            clearResults();
        }
    });

    // 显示材料数据
    function displayMaterialData(material) {
        const container = document.getElementById('results-container');
        container.innerHTML = '';

        // 创建主容器
        const mainDiv = document.createElement('div');
        mainDiv.className = 'material-display';

        // 材料标题
        const titleElement = document.createElement('h1');
        titleElement.textContent = material.name;
        titleElement.style.color = '#000080';
        titleElement.style.textAlign = 'center';
        titleElement.style.marginBottom = '20px';
        mainDiv.appendChild(titleElement);

        // 宏观物理与热工属性
        const physicalPropsSection = document.createElement('div');
        physicalPropsSection.innerHTML = '<h2 style="color: #000080; border-bottom: 1px solid #808080; padding-bottom: 5px;">宏观物理与热工属性</h2>';
        
        const propsTable = document.createElement('table');
        propsTable.style.width = '100%';
        propsTable.style.borderCollapse = 'collapse';
        propsTable.style.marginBottom = '20px';
        propsTable.innerHTML = `
            <tr style="background: #d4d0c8; font-weight: bold;">
                <th style="border: 1px solid #808080; padding: 8px; text-align: left;">属性</th>
                <th style="border: 1px solid #808080; padding: 8px; text-align: left;">数值</th>
                <th style="border: 1px solid #808080; padding: 8px; text-align: left;">单位</th>
            </tr>
            <tr>
                <td style="border: 1px solid #808080; padding: 8px;">材料类型</td>
                <td style="border: 1px solid #808080; padding: 8px;">${material.type}</td>
                <td style="border: 1px solid #808080; padding: 8px;">-</td>
            </tr>
            <tr style="background: #f8f8f8;">
                <td style="border: 1px solid #808080; padding: 8px;">理论密度</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.density_g_cm3}</td>
                <td style="border: 1px solid #808080; padding: 8px;">g/cm³</td>
            </tr>
            <tr>
                <td style="border: 1px solid #808080; padding: 8px;">熔点</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.melting_point_k}</td>
                <td style="border: 1px solid #808080; padding: 8px;">K</td>
            </tr>
        `;
        physicalPropsSection.appendChild(propsTable);

        // 热工属性系数
        const thermalPropsDiv = document.createElement('div');
        thermalPropsDiv.innerHTML = '<h3 style="color: #000080; margin-top: 15px;">热工属性温度相关系数</h3>';
        thermalPropsDiv.innerHTML += '<p style="font-size: 11px; color: #666;">计算公式: Value = A + B×T + C×T² (T 单位为 Kelvin)</p>';
        
        const thermalTable = document.createElement('table');
        thermalTable.style.width = '100%';
        thermalTable.style.borderCollapse = 'collapse';
        thermalTable.style.marginBottom = '20px';
        thermalTable.innerHTML = `
            <tr style="background: #d4d0c8; font-weight: bold;">
                <th style="border: 1px solid #808080; padding: 8px;">属性</th>
                <th style="border: 1px solid #808080; padding: 8px;">A</th>
                <th style="border: 1px solid #808080; padding: 8px;">B</th>
                <th style="border: 1px solid #808080; padding: 8px;">C</th>
                <th style="border: 1px solid #808080; padding: 8px;">单位</th>
            </tr>
            <tr>
                <td style="border: 1px solid #808080; padding: 8px;">导热系数</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.thermal_properties.thermal_conductivity_w_mk.A}</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.thermal_properties.thermal_conductivity_w_mk.B}</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.thermal_properties.thermal_conductivity_w_mk.C}</td>
                <td style="border: 1px solid #808080; padding: 8px;">W/(m·K)</td>
            </tr>
            <tr style="background: #f8f8f8;">
                <td style="border: 1px solid #808080; padding: 8px;">比热容</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.thermal_properties.specific_heat_j_kgk.A}</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.thermal_properties.specific_heat_j_kgk.B}</td>
                <td style="border: 1px solid #808080; padding: 8px; font-family: 'Courier New', monospace;">${material.thermal_properties.specific_heat_j_kgk.C}</td>
                <td style="border: 1px solid #808080; padding: 8px;">J/(kg·K)</td>
            </tr>
        `;
        thermalPropsDiv.appendChild(thermalTable);
        physicalPropsSection.appendChild(thermalPropsDiv);
        mainDiv.appendChild(physicalPropsSection);

        // 同位素组成与核属性
        const isotopeSection = document.createElement('div');
        isotopeSection.innerHTML = '<h2 style="color: #000080; border-bottom: 1px solid #808080; padding-bottom: 5px; margin-top: 25px;">同位素组成与核属性</h2>';

        material.isotopes.forEach((isotope, index) => {
            const isotopeDiv = document.createElement('div');
            isotopeDiv.style.marginBottom = '20px';
            isotopeDiv.style.padding = '15px';
            isotopeDiv.style.border = '1px solid #808080';
            isotopeDiv.style.background = index % 2 === 0 ? '#f8f8f8' : '#ffffff';

            // 同位素基本信息
            const isotopeHeader = document.createElement('h3');
            isotopeHeader.textContent = isotope.name;
            isotopeHeader.style.color = '#000080';
            isotopeHeader.style.marginTop = '0';
            isotopeDiv.appendChild(isotopeHeader);

            const isotopeInfoTable = document.createElement('table');
            isotopeInfoTable.style.width = '100%';
            isotopeInfoTable.style.borderCollapse = 'collapse';
            isotopeInfoTable.style.marginBottom = '15px';
            isotopeInfoTable.innerHTML = `
                <tr style="background: #d4d0c8; font-weight: bold;">
                    <th style="border: 1px solid #808080; padding: 6px;">原子质量 (amu)</th>
                    <th style="border: 1px solid #808080; padding: 6px;">原子丰度 (%)</th>
                    <th style="border: 1px solid #808080; padding: 6px;">原子数密度 (×10²⁴ atoms/cm³)</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #808080; padding: 6px; font-family: 'Courier New', monospace; text-align: center;">${isotope.atomic_mass}</td>
                    <td style="border: 1px solid #808080; padding: 6px; font-family: 'Courier New', monospace; text-align: center;">${isotope.abundance_percent}</td>
                    <td style="border: 1px solid #808080; padding: 6px; font-family: 'Courier New', monospace; text-align: center;">${isotope.number_density_atoms_cm3_e24}</td>
                </tr>
            `;
            isotopeDiv.appendChild(isotopeInfoTable);

            // 十群截面数据表
            const crossSectionTitle = document.createElement('h4');
            crossSectionTitle.textContent = '十群中子截面数据 (barn)';
            crossSectionTitle.style.color = '#000080';
            crossSectionTitle.style.marginBottom = '10px';
            isotopeDiv.appendChild(crossSectionTitle);

            const crossSectionTable = document.createElement('table');
            crossSectionTable.style.width = '100%';
            crossSectionTable.style.borderCollapse = 'collapse';
            crossSectionTable.style.fontSize = '11px';
            
            let tableHTML = `
                <tr style="background: #d4d0c8; font-weight: bold;">
                    <th style="border: 1px solid #808080; padding: 4px; text-align: center;">能群</th>
                    <th style="border: 1px solid #808080; padding: 4px; text-align: center;">吸收截面 (σₐ)</th>
                    <th style="border: 1px solid #808080; padding: 4px; text-align: center;">裂变截面 (σբ)</th>
                    <th style="border: 1px solid #808080; padding: 4px; text-align: center;">散射截面 (σₛ)</th>
                </tr>
            `;

            for (let i = 0; i < 10; i++) {
                const bgColor = i % 2 === 0 ? '#ffffff' : '#f8f8f8';
                tableHTML += `
                    <tr style="background: ${bgColor};">
                        <td style="border: 1px solid #808080; padding: 4px; text-align: center; font-weight: bold;">${i + 1}</td>
                        <td style="border: 1px solid #808080; padding: 4px; text-align: center; font-family: 'Courier New', monospace;">${isotope.cross_sections_barns.absorption[i]}</td>
                        <td style="border: 1px solid #808080; padding: 4px; text-align: center; font-family: 'Courier New', monospace;">${isotope.cross_sections_barns.fission[i]}</td>
                        <td style="border: 1px solid #808080; padding: 4px; text-align: center; font-family: 'Courier New', monospace;">${isotope.cross_sections_barns.scattering[i]}</td>
                    </tr>
                `;
            }

            crossSectionTable.innerHTML = tableHTML;
            isotopeDiv.appendChild(crossSectionTable);
            isotopeSection.appendChild(isotopeDiv);
        });

        mainDiv.appendChild(isotopeSection);
        container.appendChild(mainDiv);
    }

    // 清空结果显示
    function clearResults() {
        document.getElementById('results-container').innerHTML = '';
    }

    // 显示错误信息
    function showError(message) {
        const container = document.getElementById('results-container');
        container.innerHTML = `<div style="background: #ffd4d4; border: 1px solid #f00; color: #f00; padding: 10px; margin-top: 10px;">${message}</div>`;
    }
});
