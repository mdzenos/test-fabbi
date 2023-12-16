<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Process</title>
    <link rel="icon" type="image/x-icon" href={{ asset('/img/favicon.png') }}>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
        integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

    <script src={{ asset('/js/oder.js') }}></script>

    <style>
        .hidden {
            display: none;
        }

        .active {
            display: inline;
            color: #ffffff;
            background-color: #17a2b8;
        }
    </style>
</head>

<body>

    <div class="container-fluid  ">
        <div class="row justify-content-md-center">
            <div class="col-md-9 ">
                <div class="card px-5 py-3 mt-5 shadow">
                    <div class="nav nav-fill my-3">
                        <label id="nav-step1" class="nav-link shadow-sm border ml-2 active">Step 1</label>
                        <label id="nav-step2" class="nav-link shadow-sm border ml-2 ">Step 2</label>
                        <label id="nav-step3" class="nav-link shadow-sm border ml-2 ">Step 3</label>
                        <label id="nav-step4" class="nav-link shadow-sm border ml-2 ">Review</label>
                    </div>

                    <form {{-- action="/post" method="post" --}}>
                        @csrf
                        <div id="step1" class="step">
                            <label for="mealCategory">Please Select a meal<i class="fa-solid fa-user-chef"></i></label>
                            <br>
                            <select id="mealCategory" required>
                                <option value="">---</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                            </select>
                            <br>
                            <label for="numPeople">Please Enter Number of people</label>
                            <br>
                            <input type="number" id="numPeople" min="1" max="10" required>
                        </div>

                        <div id="step2" class="step hidden">
                            <label for="restaurant">Please Select a Restaurant</label>
                            <select id="restaurant" required>
                            </select>
                        </div>

                        <div id="step3" class="step hidden">
                            <div id="dishContainer">
                                <div id="dishChild">
                                    <label for="dish">Please Select a Dish</label>
                                    <select id="dish" required>
                                    </select>
                                </div>
                            </div>
                            <i onclick="addDish()" class="fas fa-plus-circle fa-2x"></i>
                        </div>

                        <div id="step4" class="step hidden">
                            <p id="review"></p>
                        </div>

                        <div id="form-navigation" class="form-navigation mt-3">
                            <button type="button" id="previous" class="previous hidden btn btn-primary float-left"
                                onclick="prevStep()">Previous</button>
                            <button type="button" id="next" class="next btn btn-primary float-right"
                                onclick="nextStep()">Next</button>
                            <button type="submit" id="btn" class="btn hidden btn-success float-right"
                            onclick="return submitForm(event)">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
