const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.json()); // 用于解析JSON格式的请求体
app.use(fileUpload());

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
const mainCourseMeatTypeTableName='main_course_meat_type'




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
   GROUP_CONCAT(DISTINCT CONCAT(h.name, ' x ', mc.quantity) ORDER BY h.name SEPARATOR ', ') AS main_courses,  
    GROUP_CONCAT(DISTINCT CONCAT(b.name, ' x ', cb.quantity) ORDER BY b.name SEPARATOR ', ') AS beverages, 
     GROUP_CONCAT(DISTINCT CONCAT(s.name, ' x ', cs.quantity) ORDER BY s.name SEPARATOR ', ') AS snacks
FROM 
    coupon c 
    LEFT JOIN coupon_main_course mc ON mc.coupon_id = c.coupon_id
    LEFT JOIN main_course h ON mc.id = h.id
    LEFT JOIN coupon_beverage cb ON cb.coupon_id = c.coupon_id
    LEFT JOIN beverage b ON cb.id = b.id
    LEFT JOIN coupon_snack cs ON cs.coupon_id = c.coupon_id
    LEFT JOIN snack s ON cs.id = s.id
GROUP BY 
    c.coupon_id, c.brand_name, c.coupon_name, c.original_price,
    c.discount_price, c.start_date, c.expire_date, c.use_restriction;
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
    db.query(`SELECT 
    mc.*, 
    GROUP_CONCAT(mt.meat_type_name SEPARATOR ', ') AS meat_type
FROM 
    ${mainCourseTableName} AS mc
LEFT JOIN 
    main_course_meat_type AS mcmt ON mc.id = mcmt.main_course_id
LEFT JOIN 
    meat_type AS mt ON mcmt.meat_type_id = mt.meat_type_id
GROUP BY 
    mc.id`, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        results.forEach(course => {
            if (course.image) {
              course.image = `data:image/png;base64,${course.image.toString('base64')}`; // 确保image字段是base64字符串
            }
          });
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
        results.forEach(beverage => {
            if (beverage.image) {
              beverage.image = `data:image/png;base64,${beverage.image.toString('base64')}`; // 确保image字段是base64字符串
            }
          });
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
        results.forEach(snack => {
            if (snack.image) {
              snack.image = `data:image/png;base64,${snack.image.toString('base64')}`; // 确保image字段是base64字符串
            }
          });
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});
app.get('/all_main_course_meat_type', (req, res) => {
    db.query(`SELECT 
    mc.id AS course_id,
    mc.name AS course_name,
    GROUP_CONCAT(mt.meat_type_name SEPARATOR ', ') AS meat_types
FROM 
    main_course AS mc
JOIN 
    main_course_meat_type AS mcmt ON mc.id = mcmt.main_course_id
JOIN 
    meat_type AS mt ON mcmt.meat_type_id = mt.meat_type_id
GROUP BY 
    mc.id, mc.name;
`, (err, results) => {
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
    if (!coupon_id || !brand_name || !coupon_name || original_price === null || discount_price === null || !start_date || !expire_date) {
        return res.status(400).send('All fields except use_restriction are required and must be valid.');
    }

    // Prepare the SQL query to insert the new coupon
    const insertCouponQuery = `INSERT INTO ${couponTableName} (coupon_id, brand_name, coupon_name, original_price, discount_price, start_date, expire_date, use_restriction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the query
    db.query(insertCouponQuery, [coupon_id, brand_name, coupon_name, original_price, discount_price, start_date, expire_date, use_restriction || null], (err, couponResult) => {
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
        executeQuery(couponMainCourseTableName, 'id', valuesMainCourse);
    }
    if (valuesBeverage.length > 0) {
        executeQuery(couponBeverageTableName, 'id', valuesBeverage);
    }
    if (valuesSnack.length > 0) {
        executeQuery(couponSnackTableName, 'id', valuesSnack);
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

app.get('/get_coupon_main_course_relation/:couponId', (req, res) => {
    const couponId = req.params.couponId;
    db.query(`SELECT 
    mc.id, 
    mc.name, 
    cmc.quantity, 
    mc.price
FROM 
    main_course AS mc
JOIN 
    coupon_main_course AS cmc 
ON 
    mc.id = cmc.id
WHERE 
    cmc.coupon_id = ?;
`, [couponId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});
  
app.get('/get_coupon_beverage_relation/:couponId', (req, res) => {
    const couponId = req.params.couponId;
    db.query(`SELECT 
    bv.id, 
    bv.name, 
    cb.quantity, 
    bv.price
FROM 
    beverage AS bv
JOIN 
    coupon_beverage AS cb
ON 
    bv.id = cb.id
WHERE 
    cb.coupon_id = ?;
`, [couponId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});

app.get('/get_coupon_snack_relation/:couponId', (req, res) => {
    const couponId = req.params.couponId;
    db.query(`SELECT 
    sn.id, 
    sn.name, 
    cs.quantity, 
    sn.price
FROM 
    snack AS sn
JOIN 
    coupon_snack AS cs
ON 
    sn.id = cs.id
WHERE 
    cs.coupon_id = ?;
`, [couponId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
            return;
        }
        console.log('Data retrieved from the database: ', results);
        res.json(results);
    });
});

  

app.delete('/delete_main_course/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    db.query(`DELETE FROM ${mainCourseTableName} WHERE id = ?`, [itemId], (err, results) => {
        if (err) {
            console.error('Error deleting coupon:', err);
            return res.status(500).send('Error deleting coupon: ' + err.message);
        }
        res.send('Coupon deleted successfully.');
    });
});

app.post('/add_main_course', (req, res) => {
    const { brand, name, price, flavor, meatTypes } = req.body;
  
    // 确认文件已上传
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image file uploaded');
    }
  
    const image = req.files.image.data; // 获取上传的文件数据
  
    // 开始一个事务
    db.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).send('Error starting transaction');
      }
  
      // 将主菜数据插入到 main_course 表中
      db.query(
        'INSERT INTO main_course (brand_name, name, price, flavor_name, image) VALUES (?, ?, ?, ?, ?)',
        [brand, name, price, flavor, image],
        (err, results) => {
          if (err) {
            console.error('Error adding main course:', err);
            return db.rollback(() => {
              res.status(500).send('Error adding main course');
            });
          }
  
          const mainCourseId = results.insertId;
  
          // 准备肉类类型数据
          const meatTypeArray = meatTypes.split(',').map(meatTypeId => parseInt(meatTypeId, 10));
  
          // 将数据插入到 main_course_meat_type 表中
          const meatTypeValues = meatTypeArray.map(meatTypeId => [mainCourseId, meatTypeId]);
  
          db.query(
            'INSERT INTO main_course_meat_type (main_course_id, meat_type_id) VALUES ?',
            [meatTypeValues],
            (err) => {
              if (err) {
                console.error('Error adding meat types:', err);
                return db.rollback(() => {
                  res.status(500).send('Error adding meat types');
                });
              }
  
              // 提交事务
              db.commit(err => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  return db.rollback(() => {
                    res.status(500).send('Error committing transaction');
                  });
                }
  
                res.send({ success: true, message: 'Main course added successfully' });
              });
            }
          );
        }
      );
    });
  });
  

  
  

app.put('/update_all_coupon_original_price', (req, res) => {
    const updateQuery = `
    UPDATE coupon
    SET original_price = (
        SELECT SUM(total_price)
        FROM (
            -- 從 main_course 計算總價
            SELECT c.coupon_id, SUM(mc.price * cmc.quantity) AS total_price
            FROM coupon_main_course cmc
            JOIN main_course mc ON cmc.id = mc.id
            JOIN coupon c ON cmc.coupon_id = c.coupon_id
            GROUP BY c.coupon_id
    
            UNION ALL
    
            -- 從 beverage 計算總價
            SELECT c.coupon_id, SUM(b.price * cb.quantity) AS total_price
            FROM coupon_beverage cb
            JOIN beverage b ON cb.id = b.id
            JOIN coupon c ON cb.coupon_id = c.coupon_id
            GROUP BY c.coupon_id
    
            UNION ALL
    
            -- 從 snack 計算總價
            SELECT c.coupon_id, SUM(s.price * cs.quantity) AS total_price
            FROM coupon_snack cs
            JOIN snack s ON cs.id = s.id
            JOIN coupon c ON cs.coupon_id = c.coupon_id
            GROUP BY c.coupon_id
        ) AS prices
        WHERE prices.coupon_id = coupon.coupon_id
    )
    `;
    db.query(updateQuery, (err, results) => {
        if (err) {
            console.error('Error updating data: ', err);
            res.status(500).send('Error updating data');
            return;
        }
        console.log('Data updated in the database: ', results);
        res.send('Data updated');
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