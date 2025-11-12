// 1. الدالة التي تبني HTML جدول المحتويات
function toc_temp(e) {
  var hc = 0;
  var l = 1;
  
  var tocHtml = "<div id='toc-post' class='d-inline-block px-3 py-2 mb-4 jt-bg-light rounded'>" +
    // زر التبديل
    "<div class='toc-toggler toc-toggle-handler d-flex align-items-center'>" + 
    "<span class='fw-light pe-3'>جدول المحتويات</span>" +
    "<span class='dropdown-toggle ms-auto'></span></div>";

  // قائمة المحتويات
  tocHtml += '<div class="toc-content-list"><ul class="pe-3 pt-3 fs-7">'; 
  
  // بناء قائمة العناوين
  tocHtml += e.map(function (data, i) {
    var n = data.level;
    var text = "";

    if (i === 0) {
      text += ''; 
    } else if (hc < n) {
      text += '<ul class="pe-3 pt-2 fs-8">';
      l++;
    } else if (hc > n && l > 1) {
      for (var m = 0; m < hc - n; m++) {
        text += "</li></ul>";
      }
      l--;
    }

    text += i > 0 ? "</li>" : "";
    text += '<li class="mb-2">';
    text += '<a class="text-reset hover-text-primary" href="#' + data.id + '">' + data.title + "</a>";

    if (i === e.length - 1) {
      for (var j = 1; j < l; j++) {
        text += "</li></ul>";
      }
    }
    hc = n;
    return text;
  }).join("");

  tocHtml += "</li></ul></div></div>";
  return tocHtml.replace(/<li>\s*<\/li>/gi, "");
}


// 2. الدالة المنفذة: استخراج العناوين وتوليد الجدول
function generateAndInsertTOC() {
  var postBody = document.getElementById('post-body');
  var tocContainer = document.getElementById('toc-placeholder');
  
  if (!postBody || !tocContainer) return;

  var headings = postBody.querySelectorAll('h2, h3, h4, h5, h6');
  var tocData = [];

  if (headings.length === 0) return;

  headings.forEach(function(heading, index) {
    var title = heading.textContent.trim();
    var id = heading.id || ('toc-h-' + (index + 1)); 
    heading.id = id; 

    tocData.push({
      title: title,
      id: id,
      level: parseInt(heading.tagName.charAt(1))
    });
  });

  if (tocData.length > 0) {
    var tocHtml = toc_temp(tocData);
    tocContainer.innerHTML = tocHtml;
    setupTOCToggle(); 
  }
}


// 3. الدالة المسؤولة عن منطق الطي (Toggle)
function setupTOCToggle() {
    var tocPost = document.getElementById('toc-post');
    var toggler = document.querySelector('#toc-placeholder .toc-toggle-handler'); 
    
    if (tocPost && toggler) {
        
        toggler.addEventListener('click', function() {
            tocPost.classList.toggle('is-open');
        });
        
        var tocLinks = tocPost.querySelectorAll('a');
        tocLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                tocPost.classList.remove('is-open'); 
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', generateAndInsertTOC);
