// Global variables
var wishes_list = {};
var country_id;
var MAX_WISHES = 3;
let wishes = [];

window.addEventListener('load', function () {
    // Request list of countries with API from server
    getCountries();
    getWishes();
    // Define other functions of the page
    searchWish();
    selectWish();
    createWish();
    selectCountry();
    submitForm();
});

//Other supportive functions 

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function addOption(id, optionText, optionValue) {
    $('#' + id).append(`<option value="${optionValue}">${optionText}</option>`)
}

function validateMaxInputs() {
    console.log(wishes_list);
    if (Object.keys(wishes_list).length == MAX_WISHES) {
        document.getElementById('submit-btn').style.display = 'block';
        document.getElementById('inp-search').disabled = true;
        document.getElementById('select-wish').disabled = true;
        document.getElementById('create-wish-btn').disabled = true;
    } else {
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('inp-search').disabled = false;
        document.getElementById('select-wish').disabled = false;
        document.getElementById('create-wish-btn').disabled = false;
    }
    if (country_id == null) {
        document.getElementById('submit-btn').style.display = 'none';
    }
}

function getNamefromId(id) {
    return wishes_list[id];
}

// Main functions

function getCountries() {
    $.ajax({
        type: "GET",
        url: "/v1/countries",
        dataType: "json",
        success: function (data) {
            var countries = data.countries;
            $('#select-country').empty();
            $('#select-country').append(`<option value="default" selected disabled>Choose your country</option>`);
            
            for (i = 0; i < countries.length; i++) {
                addOption('select-country', countries[i].name, countries[i].id);
            }
        },
        error: function (jqXHR, status, err) {
            alert(status + ":" + err);
        },
    });
}

function getWishes() {
    $.ajax({
        type: "GET",
        url: "/v1/wishes",
        dataType: "json",
        success: function (data) {
            wishes = data.wishes;
        },
        error: function (jqXHR, status, err) {
            alert(status + ":" + err);
        },
    });
}

function searchWish() {
    var search = document.getElementById('inp-search');
    var chooseDiv = document.getElementById('choose-div');
    search.addEventListener('keyup', function () {
        var val = search.value;
        if (isBlank(val)) {
            search.value = null;
            chooseDiv.style.display = 'none';
        } else {
            chooseDiv.style.display = 'block';
            $('#select-wish').empty();
            $('#select-wish').append(`<option value="default" selected disabled>'${search.value}' suggestions</option>`);
            document.getElementById('create-wish-btn').innerHTML = 'Create new wish \''+search.value+'\'';
            // get wishes with API from server

            let temp = wishes.filter(w => w.name.toLowerCase().startsWith(search.value.toLowerCase()));

            // $('#inp-search').autocomplete({source: temp})

            for (var i = 0; i < temp.length; i++) {
                console.log(temp[i]);
                addOption('select-wish', temp[i].name, temp[i].id)
            }
        }
    })
}

function selectWish() {
    var selectedWish = document.getElementById('select-wish');
    selectedWish.addEventListener('change', function () {
        var option_value = selectedWish.options[selectedWish.selectedIndex].value;
        var option_name = selectedWish.options[selectedWish.selectedIndex].innerHTML;
        if (option_value != 'default') {
            createChip(option_name, option_value);
            validateMaxInputs();
            document.getElementById('inp-search').value = "";
        }
    });
}

function createChip(wish, id) {
    // Add id and name to dictionary
    wishes_list[id] = wish;
    console.log("Wishes list : " + wishes_list);
    //Create its chip
    var chip = document.getElementById('chip-div');
    chip.innerHTML += (`<div class="chip shadow-lg" id="${id}">${wish}<span class="closebtn" onclick="deleteWish(this)">&times;</span></div>`);
    chip.style.display = 'block';
}

function createWish() {
    var create_wish_input = document.getElementById('inp-search');
    var create_wish_btn = document.getElementById('create-wish-btn');
    create_wish_btn.addEventListener('click', function () {
        var wish = create_wish_input.value;
        console.log("isBlank : " + isBlank(create_wish_input.value));
        if (isBlank(create_wish_input.value)) {
            create_wish_input.value = null;
            return;
        } else {
            // Make a request to create a wish
            $.ajax({
                type: "POST",
                url: "v1/createwish",
                data: JSON.stringify({"name": wish}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    createChip(wish, response.wish_id);
                    document.getElementById('inp-search').value = "";
                },
                error: function (jqXHR, status, err) {
                    alert(`Wish '${wish}' already exists.`);
                },
            });
            validateMaxInputs();
        }
    })
}

function deleteWish(e) {
    var id = e.parentElement.id;
    // Remove the element from the global list.
    console.log("ID of chip " + id);
    if (wishes_list.hasOwnProperty(id))
        delete wishes_list[id];
    console.log("Removed an element from the list : " + wishes_list);
    validateMaxInputs();
    e.parentElement.style.display = 'none';
}

function selectCountry() {
    var selected_country = document.getElementById('select-country');
    selected_country.addEventListener('change', function () {
        var country = selected_country.options[selected_country.selectedIndex].value;
        // Set the global country_id variable
        if (country != 'default') country_id = country;
        if (Object.keys(wishes_list).length == MAX_WISHES && country_id != null)
            document.getElementById('submit-btn').style.display = 'block';
        console.log("country chosen : " + country_id)
    })
}

function copy(){
    var dummy = document.createElement('input'),
    text = "https://mywish2020.herokuapp.com";

document.body.appendChild(dummy);
dummy.value = text;
dummy.select();
document.execCommand('copy');
document.body.removeChild(dummy);
alert('Link copied!');
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function sendEmail(){
    var inp_email = document.getElementById('inp-mail');
    var email = inp_email.value;
    if(!validateEmail(email))
    alert("You have entered an invalid email address!")
    else{
        $.ajax({
            type: "POST",
            url: "v1/addmail",
            data: JSON.stringify({"email": email}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                alert('Thanks! Email submitted successfully.');
            },
            error: function (jqXHR, status, err) {
                alert(`E-Mail already exists.`);
            },
        });
    }
}

function submitForm() {
    var submit = document.getElementById('submit-btn');
    submit.addEventListener('click', function () {
        console.log(country_id + " " + wishes_list);
        // JSON data to be sent
        var data = {"country_id": country_id, "wishes": Object.keys(wishes_list)};

        $.ajax({
            type: "POST",
            url: "/v1/submit",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var leftDivHtml =
                    `<h4 class="text-center">See how many people wish the same as you over the world.</h4>
                        
                <div class="text-success font-weight-bold text-lg text-center">In your country:</div>
                <table class="table text-center m-2">
                    <thead>
                        <th>Sr.no.</th>
                        <th>Wishes</th>
                        <th>Percentage</th>
                    </thead>
                    <tbody>
                    `

                for (var i = 0; i < response.wishes_in_same_country.length; i++) {
                    leftDivHtml +=
                        `<tr>
                        <td>${i + 1}</td>
                        <td>${getNamefromId(response.wishes_in_same_country[i].wish_id)}</td>
                        <td>${response.wishes_in_same_country[i].percentage.toFixed(2)}%</td>
                        </tr>`;
                }

                leftDivHtml += `</table>
                
            <div class="text-primary font-weight-bold text-lg text-center">Globally:</div>
            <table class="table text-center m-2">
                <thead>
                    <th>Sr.no.</th>
                    <th>Wishes</th>
                    <th>Percentage</th>
                </thead>
                <tbody>
                `;
                // Display global results
                for (var i = 0; i < response.wishes_worldwide.length; i++) {
                    leftDivHtml +=
                        `<tr>
                        <td>${i + 1}</td>
                        <td>${getNamefromId(response.wishes_worldwide[i].wish_id)}</td>
                        <td>${response.wishes_worldwide[i].percentage.toFixed(2)}%</td>
                        </tr>`;
                }
                leftDivHtml += `</tbody>
            </table>
            <div id='email-div' class="p-3">
            <label for="email" class="text-center align-self-center">Enter your email for more updates:</label><br>
            <input id="inp-mail" class="form-control m-3 w-75 align-self-center shadow text-center" style="color: rgb(3, 32, 110);" type="email" placeholder="Email" aria-label="Email"> 
            <button class='btn btn-lg btn-primary align-self-center' onclick="sendEmail()">Submit</button>
            </div>
            <div class="alert alert-success">
                <strong>Loved it?</strong><a href="#" class="alert-link" onclick='copy()'> Share it with your friends!</a>.
                <br><strong>OR</strong><br><a href="https://mywish2020.herokuapp.com/form.html" class="alert-link">Try it again</a>.
            </div>
            `;

                // Use the json data received from response
                $('#left-div').html(leftDivHtml);

                $('.row').append(`
        <footer class="page-footer font-small blue pt-4 w-100">
        <!-- Footer Links -->
        <div class="container-fluid text-center text-md-left">
            <!-- Grid row -->
            <div class="row">
                <!-- Grid column -->
                <div class="col-md-6 mt-md-0 mt-3 pl-4">
                    <!-- Content -->
                    <h5 class="text-lowercase text-primary">myWish2020.herokuapp.com</h5>
                    <p>Collaboratively find out what gifts do people around the world<br> wish to get this Christmas.<br>Let's See how people from different nations wish for Xmas.</p>
                </div>
                <!-- Grid column -->
                <hr class="clearfix w-100 d-md-none pb-3">
                <!-- Grid column -->
                <div class="col-md-3 mb-md-0 mb-3">
                    <!-- Links -->
                    <h5 class="text-uppercase">Developers</h5>
                    <ul class="list-unstyled">
                        <li>
                            <a href="https://github.com/geek-lords">Geek Lords (Team)</a>
                        </li>
                        <li>
                            <a href="https://github.com/HemilTheRebel">Hemil Ruparel (Back-end)</a>
                        </li>
                        <li>
                            <a href="https://github.com/SarveshJoshi25">Sarvesh Joshi (Back-end)</a>
                        </li>
                        <li>
                            <a href="https://github.com/abhiraj-kale">Abhiraj Kale (Front-end)</a>
                        </li
                        <li>
                            <a href="https://github.com/lmNoob">Rohan Yadav (Website Designer)</a>
                        </li>
                    </ul>
                </div>
                <!-- Grid column -->
                <!-- Grid column -->
                <div class="col-md-3 mb-md-0 mb-3">
                    <!-- Links -->
                    <h5 class="text">Follow us on Instagram</h5>
                    <ul class="list-unstyled">
                        <li>
                            <a href="https://www.instagram.com/rahem027/">Hemil Ruparel</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/_sarveshjoshi/">Sarvesh Joshi</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/aww_bhiraj/">Abhiraj Kale</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/yrohan03/">Rohan Yadav</a>
                        </li>
                    </ul>
                </div>
                <!-- Grid column -->
            </div>
            <!-- Grid row -->
        </div>
        <!-- Footer Links -->
        <!-- Copyright -->
        <div class="footer-copyright text-center py-3">If you've any queries/ problems Contact us at -
            <a href="mailto:whatisyourwish.geeklords@gmail.com">whatisyourwish.geeklords@gmail.com</a>
        </div>
        <center><span class="text-center">Project by - Geek Lords, Pune, India.</span></center>
        <!-- Copyright -->
    </footer>
                `);
            },
            error: function (jqXHR, status, err) {
                alert(status + ":" + err);
            },
        });
    })
}