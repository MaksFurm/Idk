fetch('js/data2025.json')
    .then(res => res.json())
    .then(records => {
        // Відбираємо записи, у яких є назва
        const filteredItems = records.filter(entry => entry.title);

        // Елементи фільтрів
        const unitSelect = document.getElementById('unit-select');
        const areaSelect = document.getElementById('area-select');
        const keywordInput = document.getElementById('keyword-input');

        // Унікальні значення
        const units = [...new Set(filteredItems.map(obj => obj.department).filter(Boolean))].sort();
        const areas = [...new Set(filteredItems.map(obj => obj.region).filter(Boolean))].sort();

        // Наповнення фільтрів
        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            unitSelect.appendChild(option);
        });

        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            areaSelect.appendChild(option);
        });

        // Виведення карток
        const updateCards = () => {
            const chosenUnit = unitSelect.value;
            const chosenArea = areaSelect.value;
            const searchTerm = keywordInput.value.trim().toLowerCase();
            const cardsBox = document.getElementById('card-list');

            cardsBox.innerHTML = '';

            filteredItems.forEach(record => {
                const matchesUnit = !chosenUnit || record.department === chosenUnit;
                const matchesArea = !chosenArea || record.region === chosenArea;
                const matchesSearch = !searchTerm || (
                    (record.title && record.title.toLowerCase().includes(searchTerm)) ||
                    (record.number && record.number.toString().toLowerCase().includes(searchTerm)) ||
                    (record.department && record.department.toLowerCase().includes(searchTerm)) ||
                    (record.region && record.region.toLowerCase().includes(searchTerm))
                );

                if (matchesUnit && matchesArea && matchesSearch) {
                    const itemCard = document.createElement('div');
                    itemCard.className = 'data-card';
                    itemCard.innerHTML = `
                        <div class="card-id">${record.number || ''}</div>
                        <div class="card-heading">${record.title || ''}</div>
                        <div class="card-unit">${record.department || ''}</div>
                        <div class="card-area">${record.region || ''}</div>
                        <div class="card-actions">
                            ${record.detailsLink ? `<a href="${record.detailsLink}" target="_blank">Детальніше</a>` : ''}
                            ${record.posterLink ? `<a href="${record.posterLink}" target="_blank">Постер</a>` : ''}
                        </div>
                    `;
                    cardsBox.appendChild(itemCard);
                }
            });
        };

        // Події фільтрів
        unitSelect.addEventListener('change', updateCards);
        areaSelect.addEventListener('change', updateCards);
        keywordInput.addEventListener('input', updateCards);

        updateCards();
    });
