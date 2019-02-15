
/*
   https://github.com/gittitanweb/quiz
*/

if (typeof jQuery === 'undefined') 
{
  throw new Error('Для работы Quiz, необходимо прежде загрузить библиотеку JQuery');
}

+function ($) 
{
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('Используйте последнию версию JQuery!!')
  }
}(jQuery);


;(function( $, window ){

	var defaults = {
        
        // # Параметры
        
        // Директория с файлами
        path : '',
        
        // Расширение файлов
        ext : '.json',
        
        // Префикс файлов
        prefix : 'quiz_',
        
        attr : 'data-quiz',
        
        // # События
        
        // Что то сделать перед загрузкой квиза
        before_upload : function( data, callback )
        {
            
            //console.info( 'events.before_upload', data );
            // ..
            
            callback();
        },
        
        // Что то сделать после загрузки файла
        after_upload : function( data )
        {
            //console.info( 'events.after_upload', data );
            // ..
            
        },
        
        // Что то сделать непосредственно перед запуском квиза
        before_start : function( data, callback )
        {
        
            // ..
            
            callback();
        },
        
        // Обязательный слайдер
        required_error : function()
        {
            alert('Этот слайд необходимо обязательно заполнить!');
        },
        
        // Показать форму
        view_forma : function( form_data )
        {
            console.info( 'events.form_data', form_data );
        },
        
        // Показать пользовательский слайд
        view_slide : function( slide_data )
        {
            console.info( 'events.view_slide', slide_data );
        }
       

	};

	$.fn.Quiz = function( options )
    {
        
        // Нет элемента на странице = отсыл
        if ( this.length == 0 )
        {
            return this;    
        }
        
        // Несколько элементов = Повесить на несколько
        if ( this.length > 1 ) 
        {
            this.each(function (){
                $(this).Quiz( options );
            });
            return this;
        }
        
		var THIS = this;
        var Quiz = {};
        
        // Мост для зпуска событий
        window.QuizEvent = {};
        
        // Название активного квиза
        window.QuizActive = false;
        
        
        // Запуск инициализации
        var init = function () 
        {
            Quiz.settings = $.extend(defaults, options);
            events();
        };
        
        // Запуск установки
        var events = function () 
        {
            
            // Начальные переметры
            var sett = Quiz.settings;
            var th = $( THIS );
            
            // Ячейка квиза
            var quizName = $( THIS ).attr( sett.attr );
            window.QuizEvent[ quizName ] = {};
            window.QuizActive = false;
            
            // Установка события
            th.on('click', function(){
                run_upload( this, quizName );
            });
            
        };
        
        // Загрузка файла
        var run_upload = function ( _THIS, attrName ) 
        {
        
            var sett = Quiz.settings;
            var th = $( _THIS );
            
            if( attrName !== '' )
            {
        
                //Установка данных
                window.QuizActive = attrName;
                Quiz.name = attrName;
                 
                // Сбор данных
                var filename = [sett.prefix, attrName, sett.ext].join('');
                var path = sett.path;
                var src = [ path, filename].join('/');
                
                // Операции перед отправкой данных
                sett.before_upload( [filename,path,src], function( before_upload_ok ){
                    if( before_upload_ok !== false )
                    {
                        // Получение данных
                        var getQuiz = $.getJSON( src );
                            
                            // Неудачная попытка загрузить квиз
                            getQuiz.fail(function( error ) { 
                                console.error( "getQuiz->$.getJSON", error ); 
                            });
                            
                            // Успешная загрузка данных
                            getQuiz.done(function( jsonstring ) { 
                                sett.after_upload( jsonstring );
                                run_quiz( jsonstring );
                            });
                                                    
                    }
                    else
                    {
                        console.error('events.before_upload===false');
                    }
                }); 
            }
            
        };
        
        // Запуск квиза
        var run_quiz = function( quiz_data )
        {
            
            // Сохранение( перезапись )
            Quiz.data = quiz_data;
            
            // Начальные переметры
            var sett = Quiz.settings;
            var th = $( THIS );
            
            // Операции перед построением вёрстки квиза
            sett.before_start( quiz_data, function( before_start_ok ){
                if( before_start_ok !== false )
                {
                    
                    window.QuizEvent[ Quiz.name ] = {
                        active : 0,
                        next : function()
                        {
                            next_question();
                            return true;
                        },
                        prev : function()
                        {
                            prev_question();
                            return true;
                        },
                        answer : function( string ) 
                        {
                            set_answer( string );
                            return true;
                        },
                        results : []
                    };
                    
                    // Установка позиции
                    Quiz.index = 0;
                    
                    // Запуск первого слайда
                    run_question();    
                    
                }
                else
                {
                    console.error('events.before_start===false');
                }
            });
                           
        };
        
        // Запуск слайда
        var run_question = function()
        {
        
            // Определиться с позицией
            var index = ( Quiz.index ) ? 
                            ( Quiz.index >= 0 ) ? 
                                Quiz.index 
                                : 0 
                        : 0;
            
            // Сохранение позиции( перезапись )
            window.QuizEvent[ Quiz.name ].active = Quiz.index = index;
            
            
            // Получение слайда
            var slide = false;
            if( Quiz.data.items[ index ] )
            {
                var slide = Quiz.data.items[ index ];
            }
                        
            // Передать слайд принимающей функции
            if( slide !== false )
            {
                // Показать слайдер
                view_slide( slide );
            }
            else
            {   
                // Показать форму
                view_formAction();
            }
            
        };
        
        // Следующий слайд
        var next_question = function()
        {
            
            // Начальные переметры
            var sett = Quiz.settings;
            
            // Определиться с позицией
            var index = ( Quiz.index ) ? 
                            ( Quiz.index >= 0 ) ? 
                                Quiz.index 
                                : 0 
                        : 0;
                        
            // Что сделать - если можно продолжать            
            var set_ok = function()
            {
                index++;
                
                // Установка позиции
                Quiz.index = index;
                        
                // Запуск слайда
                run_question( index );
            };
            
            // Если дальше существуют слайды.... 
            if( Quiz.data.items[ index ] )
            {                
                // Если есть поля обязательные к заполнению...
                if( Quiz.data.items[ index ].params.required === true )
                {
                    // Если с ними всё впорядке
                    if( window.QuizEvent[ Quiz.name ].results[index] && window.QuizEvent[ Quiz.name ].results[index].status === true )
                    {
                        set_ok();
                    }
                    else
                    {
                        // Ошибка, слайд обязательный к заполнению!
                        sett.required_error();
                    }
                }
                
                // Обязательных полей нет, и  - то всё ок, продалжаем...
                else 
                {
                    set_ok();
                }
            }
            
        };
                
        // Предыдущий слайд
        var prev_question = function()
        {
        
            // Определиться с позицией
            var index = ( Quiz.index ) ? 
                            ( Quiz.index >= 0 ) ? 
                                Quiz.index 
                                : 0 
                        : 0;
            
            index--;
            if( index < 0 )
            {
                index = 0;
            }
                        
            // Установка позиции
            Quiz.index = index;
            
            // Запуск слайда
            run_question( index );
                        
            return true;
            
        };
                
        // Показать слайд
        var view_slide = function( slide )
        {
            
            // Начальные переметры
            var sett = Quiz.settings;
            
            // Показать пользовательский слайд
            sett.view_slide( slide );
            
        };
        
        // Установить ответ на слайд
        var set_answer = function( answer )
        {
            
            // Определиться с позицией
            var index = ( Quiz.index ) ? 
                            ( Quiz.index >= 0 ) ? 
                                Quiz.index 
                                : 0 
                        : 0;
                        
            // Определиться со слайдом            
            var slide = Quiz.data.items[ index ];
        
            window.QuizEvent[ Quiz.name ].results[index] = {
                status : true,
                question : slide.question,
                answer : answer
            };
        
            return true;
            
        };
        
        // Показать форму захвата
        var view_formAction = function()
        {
            
            // Начальные переметры
            var sett = Quiz.settings;
            
            // Показать пользовательскую форму
            sett.view_forma( Quiz.data.forma );
            
        };
        
        init();
        return this;

    };

}( jQuery, window ));
