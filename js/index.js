let subHeader = document.querySelector('#sub-header');
let provinceSelect = document.querySelector('#province');
let citySelect = document.querySelector('#city');
let searchBtn = document.querySelector('#search-btn');
let flag = 1;


// 根据省份城市请求未来 48 小时天气
$.ajax({
    // 高德地图API
    url: 'https://restapi.amap.com/v3/config/district?',
    type: 'get',
    // 设置服务器返回数据类型，避免 CORB
    dataType: 'jsonp',
    data: {
        key: '756c4e95b0474e867dbe566fbad3b607',
        keywords: '中国',
        subdistrict: 2
    },
    success: getWeatherCallback
});

function getWeatherCallback(areaData) {
    // 默认值
    let province = '江西省', city = '南昌市';

    // 获取省份数组
    let provinceArr = areaData.districts[0].districts;

    // 将省级地区渲染到网页中
    let options = '';
    provinceArr.forEach(v => {
        let option = `<option>${v.name}</option>`
        options += option;
    });
    provinceSelect.innerHTML = '<option>请选择省份</option>' + options;

    // 省级选择框一旦变化，查询相应的一级城市
    provinceSelect.onchange = function () {
        let pValue = provinceSelect.value;
        $.ajax({
            // 高德地图API
            url: 'https://restapi.amap.com/v3/config/district?',
            type: 'get',
            // 设置服务器返回数据类型，避免 CORB
            dataType: 'jsonp',
            data: {
                key: '756c4e95b0474e867dbe566fbad3b607',
                keywords: pValue,
                subdistrict: 1
            },
            success: function (data) {
                // 获取指定省级地区的一级城市
                let citiesArr = data.districts[0].districts;
                let options = '<option>请选择城市</option>';
                citiesArr.forEach(v => {
                    options += `<option>${v.name}</option>`;
                })
                citySelect.innerHTML = options;
            }
        });
    }
    // 点击查询
    searchBtn.onclick = function () {
        province = document.querySelector('#province').value;
        city = document.querySelector('#city').value;
        if (flag-- > 0) {
            province = '江西省';
            city = '南昌市';
        }
        subHeader.innerHTML = `${province}${city}未来 48 小时天气预报`;

        let tbody = document.querySelector('tbody');
        let tbodyContent = ``;
        $.ajax({
            url: 'https://wis.qq.com/weather/common',
            type: 'get',
            dataType: 'jsonp',
            data: {
                source: 'pc',
                weather_type: 'forecast_1h',
                province: province,
                city: city
            },
            success: function (data) {
                //设置天气
                let data48 = data.data.forecast_1h;
                for (let k in data48) {
                    let obj = data48[k];
                    let timeStr = obj.update_time;
                    let time = timeStr.substring(0, 4) + '年' + timeStr.substring(4, 6) + '月' + timeStr.substring(6, 8) + '日' + timeStr.substring(8, 10) + ':' + timeStr.substring(10, 12) + ':' + timeStr.substring(12, 14);
                    let item = `<tr>
                            <td>${time}</td>
                            <td>${obj.degree}℃</td>
                            <td>${obj.weather}</td>
                            <td>${obj.wind_direction}</td>
                            <td>${obj.wind_power}</td>
                        </tr>`;
                    tbodyContent += item;
                }
                tbody.innerHTML = tbodyContent;
            }
        });
    }

    searchBtn.click();
}




