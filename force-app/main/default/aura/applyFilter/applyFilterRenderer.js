({
    // Your renderer method overrides go here
    unrender: function (cmp,helper) {
        this.superUnrender();
        window.clearInterval(cmp.get("v.setIntervalId"));
    }
})