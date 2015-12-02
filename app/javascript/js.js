$.fn.extend({
    treed: function (o) {

        var openedClass = 'glyphicon-minus-sign';
        var closedClass = 'glyphicon-plus-sign';

        if (typeof o != 'undefined'){
            if (typeof o.openedClass != 'undefined'){
                openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined'){
                closedClass = o.closedClass;
            }
        };

        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamically added icon
        tree.find('.branch .indicator').each(function(){
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});

//Initialization of treeviews

$('#tree1').treed();


function changeRightMenu(activate, menu_id) {

    $('.table_to_change').removeClass('active');
    $('.table_to_change').addClass('hidden');
    $('.'+activate).addClass('active');
    $('.'+activate).removeClass('hidden');

    $('.tabs').removeClass('active');
    $(menu_id).addClass('active');
}

function changeLeftMenu(id, menu_id) {
    $('.tree').removeClass('active');
    $('.tree').addClass('hidden');
    $(id).addClass('active');
    $(id).removeClass('hidden');

    $('.pills').removeClass('active');
    $(menu_id).addClass('active');

}

function changeColor(id){
    $('.delete_style').css('color', '');
    $('.delete_style').css('background-color', '');
    $(id).css('color', '#FFFFFF');
    $(id).css('background-color', '#428bca');


}

function resize(pop_up_id) {
    if($(pop_up_id).hasClass('down')){
        $(pop_up_id).css('width', '590px');
        $(pop_up_id).css('height', 'auto');
        $(pop_up_id).removeClass('down');
    }else{
        $(pop_up_id).css('height', '34px');
        $(pop_up_id).css('width', '300px');
        $(pop_up_id).addClass('down');
    }

}

function displayNone(pop_up_id){
    $(pop_up_id).css('display', 'none');
}

function display(pop_up_id){
    $(pop_up_id).css('display', 'block');
}

function displayAccordingToMenu() {
    if($('#tab1').hasClass('active')){
        $('#add_variants').css('display', 'block');
    }else if($('#tab2').hasClass('active')){
        $('#add_link').css('display', 'block');
    }else if($('#tab3').hasClass('active')){
        $('#add_ILI_link').css('display', 'block');
    }
}

function ILI_searchMenuChange(pop_up_id, menu_id) {
    $('.tabs_ili_search').removeClass('active');
    $(menu_id).addClass('active');
    $('.change_according_to_menu').css('display', 'none');
    $(pop_up_id).css('display', 'block');
}

//color:#FFFFFF;background-color:#428bca;
