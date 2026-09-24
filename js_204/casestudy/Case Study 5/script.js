let numbers = [25, 10, 45, 5, 30, 15];
function displayArray() {
    document.getElementById("mainArray").textContent =
        "[" + numbers.join(", ") + "]";
}
function addNumber() {
    let input =
        document.getElementById("numberInput");
    let value = Number(input.value);
    if (input.value === "") {
        alert("Please enter a number.");
        return;
    }
    numbers.push(value);
    console.log("push():", numbers);
    input.value = "";
    displayArray();
}
function removeLast() {
    if (numbers.length === 0) {
        alert("Array is empty.");
        return;
    }
    let removed = numbers.pop();
    console.log(
        "pop() removed:",
        removed
    );
    displayArray();
}
function removeFirst() {
    if (numbers.length === 0) {
        alert("Array is empty.");
        return;
    }
    let removed = numbers.shift();
    console.log(
        "shift() removed:",
        removed
    );
    displayArray();
}
function addBeginning() {
    let input =
        document.getElementById("numberInput");
    let value = Number(input.value);
    if (input.value === "") {
        alert("Enter a number.");
        return;
    }
    numbers.unshift(value);
    console.log(
        "unshift():",
        numbers
    );
    input.value = "";
    displayArray();
}
function spliceArray() {
    let index =
        Number(
            document.getElementById(
                "spliceIndex"
            ).value
        );
    let value =
        Number(
            document.getElementById(
                "spliceValue"
            ).value
        );
    if (
        index < 0 ||
        index >= numbers.length ||
        document.getElementById(
            "spliceValue"
        ).value === ""
    ) {
        alert(
            "Enter a valid index and value."
        );
        return;
    }
    let before = [...numbers];
    numbers.splice(
        index,
        1,
        value
    );
    console.log(
        "Before splice():",
        before
    );
    console.log(
        "After splice():",
        numbers
    );
    document.getElementById(
        "manipulationOutput"
    ).textContent =
        "splice(" +
        index +
        ", 1, " +
        value +
        ")\n\n" +
        "Before: [" +
        before.join(", ") +
        "]\n\n" +
        "After:  [" +
        numbers.join(", ") +
        "]";
    displayArray();
}
function sliceArray() {
    let start =
        Number(
            document.getElementById(
                "sliceStart"
            ).value
        );
    let end =
        Number(
            document.getElementById(
                "sliceEnd"
            ).value
        );
    if (
        start < 0 ||
        end <= start ||
        end > numbers.length
    ) {
        alert(
            "Enter valid start and end values."
        );
        return;
    }
    let result =
        numbers.slice(
            start,
            end
        );
    console.log(
        "slice():",
        result
    );
    document.getElementById(
        "manipulationOutput"
    ).textContent =
        "slice(" +
        start +
        ", " +
        end +
        ")\n\n" +
        "Original Array: [" +
        numbers.join(", ") +
        "]\n\n" +
        "Extracted Array: [" +
        result.join(", ") +
        "]";
}
function runMap() {
    let result =
        numbers.map(function(value) {
            return value * 2;
        });
    console.log(
        "map():",
        result
    );
    document.getElementById(
        "iterationOutput"
    ).textContent =
        "map() → Doubles every number\n\n" +
        "Original:\n[" +
        numbers.join(", ") +
        "]\n\n" +
        "Result:\n[" +
        result.join(", ") +
        "]";
}
function runFilter() {
    let result =
        numbers.filter(function(value) {
            return value > 25;
        });
    console.log(
        "filter():",
        result
    );
    document.getElementById(
        "iterationOutput"
    ).textContent =
        "filter() → Numbers greater than 25\n\n" +
        "Original:\n[" +
        numbers.join(", ") +
        "]\n\n" +
        "Result:\n[" +
        result.join(", ") +
        "]";
}
function runReduce() {
    let sum =
        numbers.reduce(
            function(total, value) {
                return total + value;
            },
            0
        );
    console.log(
        "reduce():",
        sum
    );
    document.getElementById(
        "iterationOutput"
    ).textContent =
        "reduce() → Calculates the sum\n\n" +
        "Array:\n[" +
        numbers.join(", ") +
        "]\n\n" +
        "Sum = " +
        sum;
}
function runForEach() {
    let result = "";
    numbers.forEach(
        function(value, index) {
            result +=
                "Index " +
                index +
                " → " +
                value +
                "\n";
            console.log(
                "forEach():",
                index,
                value
            );
        }
    );
    document.getElementById(
        "iterationOutput"
    ).textContent =
        "forEach() → Iterates through every element\n\n" +
        result;
}
function clearArray() {
    numbers = [];
    console.log(
        "Array cleared:",
        numbers
    );
    displayArray();
    document.getElementById(
        "manipulationOutput"
    ).textContent =
        "Array cleared successfully.";
}
function runCaseStudy() {
    let caseStudyArray =
        [25, 10, 45, 5, 30, 15];
    let maximum =
        caseStudyArray.reduce(
            function(max, value) {
                return value > max
                    ? value
                    : max;
            }
        );
    let minimum =
        caseStudyArray.reduce(
            function(min, value) {
                return value < min
                    ? value
                    : min;
            }
        );
    document.getElementById(
        "maximum"
    ).textContent = maximum;
    document.getElementById(
        "minimum"
    ).textContent = minimum;
    document.getElementById(
        "caseStudyOutput"
    ).textContent =
        "Array: [" +
        caseStudyArray.join(", ") +
        "]\n\n" +
        "Using reduce() to compare each element:\n\n" +
        "Maximum Value: " +
        maximum +
        "\n" +
        "Minimum Value: " +
        minimum;
    console.log(
        "Case Study Array:",
        caseStudyArray
    );
    console.log(
        "Maximum Value:",
        maximum
    );
    console.log(
        "Minimum Value:",
        minimum
    );
}
displayArray();
