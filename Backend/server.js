const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // 用于解析JSON格式的请求体

// 假设你的表名为 user，根据你真实的表名修改此处
const userTableName = 'all_user';

const brandTableName = 'all_brand_name';
const mainCourseTableName='main_course';
const beverageTableName='beverage';
const snackTableName='snack';
const couponMainCourseTableName='coupon_main_course'
const couponBeverageTableName='coupon_beverage'
const couponSnackTableName='coupon_snack'
const couponTableName = 'coupon';




const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'mydb',
    port: 8889 // MAMP MySQL端口，根据实际情况更改
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to database');
});



app.get('/brand_append', (req, res) => {
    db.query(`SELECT * FROM ${brandTableName}`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});


app.get('/next_coupon_id', (req, res) => {
    db.query(`SELECT MAX(coupon_id) + 1 AS next_coupon_id FROM ${couponTableName}`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});




app.get('/all_coupons_with_items', (req, res) => {
    const query = `
    SELECT 
    c.coupon_id, 
    c.brand_name,
    c.coupon_name, 
    c.original_price, 
    c.discount_price, 
    c.start_date, 
    c.expire_date, 
    c.use_restriction, 
    GROUP_CONCAT(DISTINCT CONCAT(h.main_course_name, COALESCE(CONCAT(' (', h.flavor_name, ')'), ''), ' x ', mc.quantity) ORDER BY h.main_course_name SEPARATOR ', ') AS main_courses, 
    GROUP_CONCAT(DISTINCT CONCAT(b.beverage_name, ' (', b.beverage_size, ') (', b.iced_hot_name, ') x ', cb.quantity) ORDER BY b.beverage_name SEPARATOR ', ') AS beverages, 
    GROUP_CONCAT(DISTINCT CONCAT(s.snack_name, COALESCE(CONCAT(' (', s.snack_size, ')'), ''), ' x ', cs.quantity) ORDER BY s.snack_name SEPARATOR ', ') AS snacks
FROM 
    coupon c 
    LEFT JOIN coupon_main_course mc ON mc.coupon_id = c.coupon_id
    LEFT JOIN main_course h ON mc.main_course_id = h.main_course_id
    LEFT JOIN coupon_beverage cb ON cb.coupon_id = c.coupon_id
    LEFT JOIN beverage b ON cb.beverage_id = b.beverage_id
    LEFT JOIN coupon_snack cs ON cs.coupon_id = c.coupon_id
    LEFT JOIN snack s ON cs.snack_id = s.snack_id
GROUP BY 
    c.coupon_id, c.brand_name, c.coupon_name, c.original_price, c.discount_price, c.start_date, c.expire_date, c.use_restriction;
`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        const formattedResults = results.map(coupon => ({
            coupon_id: coupon.coupon_id,
            brand_name: coupon.brand_name,
            coupon_name: coupon.coupon_name,
            original_price: coupon.original_price,
            discount_price: coupon.discount_price,
            start_date: coupon.start_date,
            expire_date: coupon.expire_date,
            use_restriction: coupon.use_restriction,
            main_courses: coupon.main_courses ? coupon.main_courses.split(', ') : [],
            beverages: coupon.beverages ? coupon.beverages.split(', ') : [],
            snacks: coupon.snacks ? coupon.snacks.split(', ') : []
        }));
        res.json(formattedResults);
    });
});

app.get('/all_main_course', (req, res) => {
    db.query(`SELECT * FROM ${mainCourseTableName}`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});

app.get('/all_beverage', (req, res) => {
    db.query(`SELECT * FROM ${beverageTableName}`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});

app.get('/all_snack', (req, res) => {
    db.query(`SELECT * FROM ${snackTableName}`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});

app.post('/add_coupon', (req, res) => {
    // Destructure and validate required fields from the request body
    const {
        coupon_id, brand_name, coupon_name, original_price, discount_price, start_date, expire_date, use_restriction
    } = req.body;

    // Check if all required fields are present and not null
    if (!coupon_id || !brand_name || !coupon_name || original_price === null || discount_price === null || !start_date || !expire_date || !use_restriction) {
        return res.status(400).send('All fields are required and must be valid.');
    }

    // Prepare the SQL query to insert the new coupon
    const insertCouponQuery = `INSERT INTO ${couponTableName} (coupon_id, brand_name, coupon_name, original_price, discount_price, start_date, expire_date, use_restriction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the query
    db.query(insertCouponQuery, [coupon_id, brand_name, coupon_name, original_price, discount_price, start_date, expire_date, use_restriction], (err, couponResult) => {
        if (err) {
            console.error('Error adding coupon:', err);
            return res.status(500).send('Error adding coupon: ' + err.message);
        }

        console.log('Coupon added to the database with ID:', coupon_id);

        // Optionally, handle the addition of related items like main courses, beverages, and snacks here

        // Send a success response
        res.status(201).send('Coupon added successfully');
    });
});

app.post('/add_coupon_items_relation', (req, res) => {
    const items = Array.isArray(req.body) ? req.body : [req.body]; // Ensure items are always processed as an array

    const valuesMainCourse = [];
    const valuesBeverage = [];
    const valuesSnack = [];

    let responseSent = false; // Variable to track if response has been sent

    items.forEach(item => {
        const value = [item.nextCouponId, item.id, item.quantity];
        switch (item.productType) {
            case 'mainCourse':
                valuesMainCourse.push(value);
                break;
            case 'beverage':
                valuesBeverage.push(value);
                break;
            case 'snack':
                valuesSnack.push(value);
                break;
        }
    });

    const executeQuery = (tableName, columnName, values) => {
        const insertCouponQuery = `INSERT INTO ${tableName} (coupon_id, ${columnName}, quantity) VALUES ?`;
        db.query(insertCouponQuery, [values], (err, results) => {
            if (err) {
                console.error('Error adding coupon:', err);
                if (!responseSent) { // Check if response has already been sent
                    responseSent = true; // Set responseSent to true
                    return res.status(500).send('Error adding coupon: ' + err.message);
                }
            }
            if (!responseSent) { // Check if response has already been sent
                responseSent = true; // Set responseSent to true
                res.send('Coupon items added successfully.');
            }
        });
    };

    // Execute queries based on product type
    if (valuesMainCourse.length > 0) {
        executeQuery(couponMainCourseTableName, 'main_course_id', valuesMainCourse);
    }
    if (valuesBeverage.length > 0) {
        executeQuery(couponBeverageTableName, 'beverage_id', valuesBeverage);
    }
    if (valuesSnack.length > 0) {
        executeQuery(couponSnackTableName, 'snack_id', valuesSnack);
    }
});

app.delete('/delete_coupon/:couponId', (req, res) => {
    const couponId = req.params.couponId;

    db.query(`DELETE FROM ${couponTableName} WHERE coupon_ID = ?`, [couponId], (err, results) => {
        if (err) {
            console.error('Error deleting coupon:', err);
            return res.status(500).send('Error deleting coupon: ' + err.message);
        }
        res.send('Coupon deleted successfully.');
    });
});

  




//CRUD----------------------------------------------------------------











// 获取数据
app.get('/all', (req, res) => {
    db.query(`SELECT * FROM ${userTableName}`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});

// 添加数据
app.post('/add', (req, res) => {
    const { name, address, tel } = req.body;
    const insertQuery = `INSERT INTO ${userTableName} (name, address, tel) VALUES (?, ?, ?)`;
    db.query(insertQuery, [name, address, tel], (err, results) => {
        if (err) {
            console.error('Error adding data: ', err);
            res.status(500).send('Error adding data');
            return;
        }
        console.log('Data added to the database: ', results);
        res.status(201).send('Data added');
    });
});

// 删除数据
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM ${userTableName} WHERE id = ?`;
    db.query(deleteQuery, [id], (err, results) => {
        if (err) {
            console.error('Error deleting data: ', err);
            res.status(500).send('Error deleting data');
            return;
        }
        console.log('Data deleted from the database: ', results);
        res.send('Data deleted');
    });
});

// 更新数据
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, tel } = req.body;
    const updateQuery = `UPDATE ${userTableName} SET name = ?, address = ?, tel = ? WHERE id = ?`;
    db.query(updateQuery, [name, address, tel, id], (err, results) => {
        if (err) {
            console.error('Error updating data: ', err);
            res.status(500).send('Error updating data');
            return;
        }
        console.log('Data updated in the database: ', results);
        res.send('Data updated');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const loginQuery = `SELECT * FROM ${userTableName} WHERE username = ?`;

    // 應該先確認 username 和 password 是否存在
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    db.query(loginQuery, [username], async (err, results) => {
        if (err) {
            console.error('Login error: ', err);
            return res.status(500).send('Error during login');
        }
        // 檢查是否有結果且密碼是否正確
        
            // 直接比較明文密碼
            if (password === results[0].password&&results.length > 0) {
                console.log('Login successful: ', results);
                return res.status(200).send('Login successful');
            } else {
                console.log('Invalid login credentials');
                return res.status(401).send('Invalid credentials');
            }
       
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});